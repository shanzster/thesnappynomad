import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

/* ============ Mascot ============ */

export function Mascot({ className }) {
  return (
    <img
      src="/logo/mascot.png"
      alt="The Snappy Nomad mascot"
      className={className}
    />
  )
}

/* ============ "snap!" hover pop ============ */

export function SnapEffect() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onOver = (e) => {
      const target = e.target.closest('a, button')
      if (!target || target.dataset.snapCooldown) return
      target.dataset.snapCooldown = '1'
      setTimeout(() => delete target.dataset.snapCooldown, 700)

      const pop = document.createElement('span')
      pop.className = e.clientY < 90 ? 'snap-pop snap-pop--below' : 'snap-pop'
      pop.textContent = 'snap!'
      pop.style.left = `${e.clientX}px`
      pop.style.top = `${e.clientY}px`
      pop.style.setProperty('--rot', `${Math.random() * 24 - 12}deg`)
      document.body.appendChild(pop)
      pop.addEventListener('animationend', () => pop.remove())
    }

    document.addEventListener('mouseover', onOver)
    return () => document.removeEventListener('mouseover', onOver)
  }, [])
  return null
}

/* ============ Shared beat for synced cyclers ============ */

export function useTick(intervalMs = 200) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((t) => t + 1), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return tick
}

/* ============ Data ============ */

// Drop your stamp PNGs in public/stamps/ and list them here.
export const STAMP_IMAGES = []

// Travel photos, one per stamp and in the SAME ORDER as STAMP_PLACEHOLDERS —
// the polaroid and the stamp flip together, so index i must match place i.
// Swap any entry with your own shot in public/photos/ whenever you like.
export const PHOTO_IMAGES = [
  { src: '/photos/manila.jpg', caption: 'manila, first stop' },
  { src: '/photos/el-nido.jpg', caption: 'el nido, palawan' },
  { src: '/photos/siargao.jpg', caption: 'cloud 9, siargao' },
  { src: '/photos/cebu.jpg', caption: 'kawasan, cebu' },
  { src: '/photos/bohol.jpg', caption: 'chocolate hills, bohol' },
  { src: '/photos/vigan.jpg', caption: 'calle crisologo, vigan' },
  { src: '/photos/sagada.jpg', caption: 'sea of clouds, sagada' },
  { src: '/photos/batanes.jpg', caption: 'rolling hills, batanes' },
  { src: '/photos/coron.jpg', caption: 'hidden lagoon, coron' },
  { src: '/photos/davao.jpg', caption: 'durian run, davao' },
]

export const STAMP_PLACEHOLDERS = [
  <div className="stamp stamp--circle">MNL<small>✈ arrived · 2026</small></div>,
  <div className="stamp stamp--rect">EL NIDO<small>Palawan · PH</small></div>,
  <div className="stamp stamp--oval">SIARGAO<small>surf check</small></div>,
  <div className="stamp stamp--rect stamp--blue">ADMITTED<small>Cebu · immigration</small></div>,
  <div className="stamp stamp--circle stamp--blue">BOHOL<small>chocolate hills</small></div>,
  <div className="stamp stamp--rect">VIGAN<small>heritage city</small></div>,
  <div className="stamp stamp--oval stamp--red">SAGADA<small>mountain province</small></div>,
  <div className="stamp stamp--circle">BATANES<small>north of north</small></div>,
  <div className="stamp stamp--rect stamp--blue">CORON<small>shipwreck dive</small></div>,
  <div className="stamp stamp--oval">DAVAO<small>durian country</small></div>,
]

export const PHOTO_PLACEHOLDERS = [
  { emoji: '🏝️', caption: 'el nido, palawan', bg: 'linear-gradient(160deg, #bfd3ff 0%, #dce9ff 60%, #f6e7c9 100%)' },
  { emoji: '🌅', caption: 'siargao golden hour', bg: 'linear-gradient(160deg, #ffd94a 0%, #ff9d5c 55%, #e8401c 100%)' },
  { emoji: '⛰️', caption: 'sagada highlands', bg: 'linear-gradient(160deg, #bfd3ff 0%, #9fc49a 60%, #4c6e3f 100%)' },
  { emoji: '🛺', caption: 'manila side streets', bg: 'linear-gradient(160deg, #f6e7c9 0%, #e8c98a 60%, #b0885a 100%)' },
  { emoji: '🐚', caption: 'camiguin shores', bg: 'linear-gradient(160deg, #bff0e8 0%, #7fd4c8 60%, #2b8f9e 100%)' },
  { emoji: '🌋', caption: 'mayon, albay', bg: 'linear-gradient(160deg, #d6c4f0 0%, #b98ec9 55%, #ff6b1a 100%)' },
  { emoji: '🏖️', caption: 'boracay white beach', bg: 'linear-gradient(160deg, #bfe8ff 0%, #8fd0f0 55%, #f6e7c9 100%)' },
  { emoji: '🌾', caption: 'batanes rolling hills', bg: 'linear-gradient(160deg, #d9ecb8 0%, #a8c97a 55%, #5b8a4a 100%)' },
]

// x/y position each camera inside the open luggage photo; img (optional)
// replaces the emoji with a cutout PNG, e.g. img: '/cameras/instax.png'
export const CAMERAS = [
  { name: 'Instax Mini 11', img: '/cameras/instax.png', w: '110px', tag: 'Instant film', emoji: '📸', price: 349, blurb: 'Point, shoot, shake the print. Souvenirs on the spot.', x: '10%', y: '14%', tilt: '-7deg' },
  { name: 'Kodak Charmera', img: '/cameras/charmera.png', w: '84px', tag: 'Film · 1987', emoji: '🎞️', price: 299, blurb: 'Tiny, grainy, gorgeous. The most collectible thing we own.', x: '32%', y: '10%', tilt: '5deg' },
  { name: 'Canon EOS M10', img: '/cameras/m10.png', w: '122px', tag: 'Mirrorless', emoji: '📷', price: 549, blurb: 'Flip-screen selfies and crispy street shots in one bag.', x: '56%', y: '12%', tilt: '-4deg' },
  { name: 'GoPro Hero 13', img: '/cameras/gopro.png', w: '88px', tag: 'Action cam', emoji: '🏄', price: 599, blurb: 'Strap it, dunk it, drop it. It films through everything.', x: '13%', y: '48%', tilt: '6deg' },
  { name: 'Insta360', img: '/cameras/insta360.png', w: '74px', tag: '360° action', emoji: '🌀', price: 649, blurb: 'Shoot everything, frame it later. Third-person magic.', x: '76%', y: '24%', tilt: '-5deg' },
  { name: 'Canon EOS Rebel T6', img: '/cameras/rebel.png', w: '142px', tag: 'DSLR', emoji: '🌄', price: 499, blurb: 'The trusty workhorse for golden-hour everything.', x: '57%', y: '52%', tilt: '4deg' },
  { name: 'Olympus FE-4000', img: '/cameras/olympus.png', w: '112px', tag: 'Y2K digicam', emoji: '✨', price: 329, blurb: 'Flash on, vibes immaculate. Digicam-core forever.', x: '28%', y: '60%', tilt: '-3deg' },
]

/* ============ Cyclers ============ */

export function StampCycler({ step }) {
  if (STAMP_IMAGES.length) {
    return (
      <img
        src={STAMP_IMAGES[step % STAMP_IMAGES.length]}
        alt=""
        className="stampcycler__img"
        aria-hidden="true"
      />
    )
  }
  return STAMP_PLACEHOLDERS[step % STAMP_PLACEHOLDERS.length]
}

export function PolaroidCycler({ step }) {
  if (PHOTO_IMAGES.length) {
    const photo = PHOTO_IMAGES[step % PHOTO_IMAGES.length]
    return (
      <div className="polaroid">
        <img src={photo.src} alt="" className="polaroid__photo polaroid__photo--img" />
        <p className="polaroid__caption">{photo.caption}</p>
      </div>
    )
  }
  const photo = PHOTO_PLACEHOLDERS[step % PHOTO_PLACEHOLDERS.length]
  return (
    <div className="polaroid">
      <div className="polaroid__photo" style={{ background: photo.bg }} aria-hidden="true">
        {photo.emoji}
      </div>
      <p className="polaroid__caption">{photo.caption}</p>
    </div>
  )
}

/* ============ Postcard back — the destination photo IS the stamp ============ */

export function PostcardFront({ photo, place, rot }) {
  return (
    <div className="pmail" style={{ '--rot': rot }}>
      <header className="pmail__head">
        <span className="pmail__title">Post Card</span>
        <span className="pmail__sub">carte postale</span>
      </header>
      <div className="pmail__stampzone" aria-hidden="true">
        <div className="pmail__stamp">
          {photo.img ? (
            <img src={photo.img} alt="" />
          ) : (
            <span className="pmail__stampph" style={{ background: photo.bg }}>
              {photo.emoji}
            </span>
          )}
        </div>
        <div className="pmail__postmark">{place} · PHL</div>
      </div>
      <div className="pmail__body">
        <p className="pmail__msg">
          {photo.caption} —<br />
          wish you were here! ✈
        </p>
        <div className="pmail__divider" aria-hidden="true" />
        <div className="pmail__addr" aria-hidden="true">
          <span>The Snappy Nomad</span>
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

/* ============ Realistic postcard back (message side) ============ */

export function PostcardBack({ card }) {
  return (
    <article className="pback" style={{ '--rot': card.rot || '0deg' }}>
      <header className="pback__head">
        <span className="pback__title">Post Card</span>
        <span className="pback__sub">carte postale</span>
      </header>
      <div className="pback__stampzone" aria-hidden="true">
        <div className="pback__stamp">
          <span>{card.stampEmoji}</span>
          <small>{card.place}</small>
        </div>
        <div className="pback__postmark">{card.place} · {card.date}</div>
      </div>
      <div className="pback__body">
        <p className="pback__message">
          {card.message}
          <span className="pback__sign">— {card.name}</span>
        </p>
        <div className="pback__divider" aria-hidden="true" />
        <div className="pback__address" aria-hidden="true">
          <span>The Snappy Nomad</span>
          <span />
          <span />
          <span />
        </div>
      </div>
    </article>
  )
}

/* ============ Luggage: closed by default, tap to swing it open ============ */

// Soft zipper whoosh, synthesized — no audio file needed
function playZipSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const dur = 0.28
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.6) * 0.6
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 2.5
    filter.frequency.setValueAtTime(500, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + dur)
    const gain = ctx.createGain()
    gain.gain.value = 0.18
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start()
    src.onended = () => ctx.close()
  } catch {
    /* audio is a garnish — never break the open animation over it */
  }
}

export function GearLuggage() {
  const [phase, setPhase] = useState('closed')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const openUp = () => {
    if (phase !== 'closed') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('open')
      return
    }
    setPhase('opening')
    playZipSound()
    setTimeout(() => setPhase('open'), 430)
  }

  const onParallax = (e) => {
    const stage = e.currentTarget
    const r = stage.getBoundingClientRect()
    stage.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5) * 2)
    stage.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5) * 2)
  }

  const resetParallax = (e) => {
    e.currentTarget.style.setProperty('--px', 0)
    e.currentTarget.style.setProperty('--py', 0)
  }

  if (phase !== 'open') {
    return (
      <div className="lugcase">
        <button
          type="button"
          className={
            phase === 'opening'
              ? 'lugcase__closed lugcase__closed--wiggle'
              : 'lugcase__closed'
          }
          onClick={openUp}
          aria-label="Open the luggage to see the cameras"
        >
          <img src="/images/luggage-closed.png" alt="" className="lugcase__img" />
          <span className="lugcase__hint">
            {phase === 'opening' ? 'unzipping…' : 'tap to open ✦'}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="lugcase lugcase--open">
      <div
        className="luggage"
        onMouseMove={onParallax}
        onMouseLeave={resetParallax}
      >
        <img
          src="/images/luggage-open.png"
          alt=""
          className="luggage__photo"
          aria-hidden="true"
        />
        <div className="luggage__items">
          {CAMERAS.map((cam, i) => (
            <button
              key={cam.name}
              type="button"
              className="lug-item"
              onClick={() => setSelected(cam)}
              style={{
                left: cam.x,
                top: cam.y,
                '--tilt': cam.tilt,
                '--pop-delay': `${120 + i * 70}ms`,
                '--depth': (i % 3) + 1,
              }}
            >
              {cam.img ? (
                <img
                  src={cam.img}
                  alt=""
                  className="lug-item__photo"
                  style={cam.w ? { width: cam.w } : undefined}
                />
              ) : (
                <span className="lug-item__emoji" aria-hidden="true">{cam.emoji}</span>
              )}
              <span className="lug-item__label">
                {cam.name}
                <em>₱{cam.price}/day</em>
              </span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="camdetail"
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
          onClick={() => setSelected(null)}
        >
          <div className="camdetail__card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="camdetail__close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            {selected.img ? (
              <img src={selected.img} alt="" className="camdetail__photo" />
            ) : (
              <span className="camdetail__emoji" aria-hidden="true">
                {selected.emoji}
              </span>
            )}
            <span className="camdetail__tag">{selected.tag}</span>
            <h3 className="camdetail__name">{selected.name}</h3>
            <p className="camdetail__blurb">{selected.blurb}</p>
            <div className="camdetail__foot">
              <span className="camdetail__price">
                ₱{selected.price}
                <small>/day</small>
              </span>
              <button type="button" className="btn btn--primary">
                Rent this cam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ============ Nav + Footer ============ */

const PAGES = [
  { to: '/gears', label: 'Gears' },
  { to: '/postcards', label: 'Postcards' },
  { to: '/app', label: 'The App' },
  { to: '/about', label: 'About' },
  { to: '/socials', label: 'Socials' },
]

export function Nav() {
  const { pathname } = useLocation()
  const solid = pathname !== '/'
  return (
    <nav className={solid ? 'nav nav--solid' : 'nav'}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <Mascot className="nav__mascot" />
          <span className="wordmark">The Snappy Nomad</span>
        </Link>
        <div className="nav__links">
          {PAGES.map((p) => (
            <NavLink key={p.to} to={p.to} className="nav__link">
              {p.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__checker" />
      <div className="container footer__inner">
        <Mascot className="footer__mascot" />
        <div>
          <div className="footer__wordmark">The Snappy Nomad</div>
          <div className="footer__tagline">Snap · Pose · Wander</div>
        </div>
        <div className="footer__links">
          {PAGES.map((p) => (
            <Link key={p.to} to={p.to}>{p.label}</Link>
          ))}
        </div>
        <p className="footer__copy">
          © 2026 The Snappy Nomad. Shoot film, not people. 📷
        </p>
      </div>
    </footer>
  )
}
