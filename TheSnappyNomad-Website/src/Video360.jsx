import { useEffect, useRef, useState } from 'react'

// Drag-around 360° video player. Renders straight from the camera's own
// file: 'dfisheye' un-warps the two raw lens circles (Insta360 .lrv/.insv
// proxies) live in a shader — no stitching software needed. 'equirect'
// plays normal stitched 360 exports. WebGL unavailable → plain <video>.

const VERT = `
attribute vec2 aPos;
varying vec2 vNdc;
void main() {
  vNdc = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
varying vec2 vNdc;
uniform sampler2D uTex;
uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
uniform float uProjection; // 0 = equirect, 1 = dual fisheye

const float PI = 3.141592653589793;
const float HALF_LENS = 1.6581; // 190deg lens / 2, in radians
const float BLEND = 0.10;       // seam feather width (radians)

vec3 rayDir() {
  float t = 0.7673; // tan(75deg vertical fov / 2)
  vec3 d = normalize(vec3(vNdc.x * t * uAspect, vNdc.y * t, -1.0));
  float cp = cos(uPitch), sp = sin(uPitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(uYaw), sy = sin(uYaw);
  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);
  return d;
}

vec4 sampleEquirect(vec3 d) {
  float u = atan(d.x, -d.z) / (2.0 * PI) + 0.5;
  float v = asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5;
  return texture2D(uTex, vec2(u, v));
}

// Equidistant fisheye: angle from the lens axis maps linearly to radius
vec4 sampleFish(float theta, float phi, float xOff, float xSign) {
  float r = (theta / HALF_LENS) * 0.5;
  vec2 local = vec2(0.5 + r * cos(phi) * xSign, 0.5 + r * sin(phi));
  return texture2D(uTex, vec2(xOff + local.x * 0.5, local.y));
}

vec4 sampleDualFisheye(vec3 d) {
  float thetaF = acos(clamp(-d.z, -1.0, 1.0)); // front lens, looking -Z
  float thetaB = PI - thetaF;                  // back lens, looking +Z
  float phiF = atan(d.y, d.x);
  float phiB = atan(d.y, -d.x);
  vec4 front = sampleFish(thetaF, phiF, 0.0, 1.0);
  vec4 back = sampleFish(thetaB, phiB, 0.5, 1.0);
  float wf = 1.0 - smoothstep(PI * 0.5 - BLEND, PI * 0.5 + BLEND, thetaF);
  return mix(back, front, wf);
}

void main() {
  vec3 d = rayDir();
  gl_FragColor = uProjection < 0.5 ? sampleEquirect(d) : sampleDualFisheye(d);
}`

function makeProgram(gl) {
  const compile = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s))
    }
    return s
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog))
  }
  return prog
}

export default function Video360({ src, projection = 'dfisheye', label = '360° view' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [dragged, setDragged] = useState(false)
  const [glFailed, setGlFailed] = useState(false)

  // play intent, readable from inside the render-loop effect
  const playingRef = useRef(true)
  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    let gl
    try {
      gl = canvas.getContext('webgl', { antialias: false })
      if (!gl) throw new Error('no webgl')
      const prog = makeProgram(gl)
      gl.useProgram(prog)

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([16, 18, 31]))

      const uYaw = gl.getUniformLocation(prog, 'uYaw')
      const uPitch = gl.getUniformLocation(prog, 'uPitch')
      const uAspect = gl.getUniformLocation(prog, 'uAspect')
      const uProjection = gl.getUniformLocation(prog, 'uProjection')
      gl.uniform1f(uProjection, projection === 'equirect' ? 0 : 1)

      let yaw = 0
      let pitch = 0
      let velYaw = 0
      let velPitch = 0
      let dragging = false
      let lastX = 0
      let lastY = 0
      let visible = true
      let raf = 0

      const onDown = (e) => {
        dragging = true
        lastX = e.clientX
        lastY = e.clientY
        velYaw = velPitch = 0
        canvas.setPointerCapture(e.pointerId)
        setDragged(true)
      }
      const onMove = (e) => {
        if (!dragging) return
        const k = 0.0045
        const dYaw = (e.clientX - lastX) * k
        const dPitch = (e.clientY - lastY) * k
        yaw += dYaw
        pitch += dPitch
        velYaw = dYaw
        velPitch = dPitch
        lastX = e.clientX
        lastY = e.clientY
      }
      const onUp = () => { dragging = false }
      canvas.addEventListener('pointerdown', onDown)
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerup', onUp)
      canvas.addEventListener('pointercancel', onUp)

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(frame)
        if (!visible) video.pause()
        else if (playingRef.current) video.play().catch(() => {})
      })
      io.observe(canvas)

      const frame = () => {
        if (!visible) { raf = 0; return }
        if (!dragging) {
          yaw += velYaw
          pitch += velPitch
          velYaw *= 0.94
          velPitch *= 0.94
        }
        pitch = Math.max(-1.45, Math.min(1.45, pitch))

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = Math.round(canvas.clientWidth * dpr)
        const h = Math.round(canvas.clientHeight * dpr)
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w
          canvas.height = h
        }
        gl.viewport(0, 0, w, h)
        if (video.readyState >= 2) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video)
        }
        gl.uniform1f(uYaw, yaw)
        gl.uniform1f(uPitch, pitch)
        gl.uniform1f(uAspect, w / Math.max(1, h))
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)

      return () => {
        if (raf) cancelAnimationFrame(raf)
        io.disconnect()
        canvas.removeEventListener('pointerdown', onDown)
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerup', onUp)
        canvas.removeEventListener('pointercancel', onUp)
        // don't lose the context here — the canvas keeps and reuses it
        // when the effect re-runs (StrictMode remounts, prop changes)
      }
    } catch (err) {
      console.warn('Video360: WebGL unavailable, falling back to flat video.', err)
      setGlFailed(true)
    }
  }, [projection])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const goFullscreen = () => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (document.fullscreenElement) document.exitFullscreen()
    else wrap.requestFullscreen?.()
  }

  if (glFailed) {
    return (
      <div className="v360 v360--fallback">
        <video src={src} controls muted loop playsInline className="v360__plainvideo" />
      </div>
    )
  }

  return (
    <div className="v360" ref={wrapRef} aria-label={label}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        autoPlay
        playsInline
        crossOrigin="anonymous"
        className="v360__source"
        aria-hidden="true"
      />
      <canvas ref={canvasRef} className="v360__canvas" />
      <span className="v360__badge" aria-hidden="true">360°</span>
      {!dragged && (
        <span className="v360__hint" aria-hidden="true">drag to look around ✦</span>
      )}
      <div className="v360__controls">
        <button
          type="button"
          className="v360__btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button
          type="button"
          className="v360__btn"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          type="button"
          className="v360__btn v360__btn--fs"
          onClick={goFullscreen}
          aria-label="Toggle fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  )
}
