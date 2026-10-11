import { Link } from 'react-router-dom'
import { CAMERAS } from '../shared.jsx'
import { CAM_DETAILS } from '../camsheet.jsx'
import Video360 from '../Video360.jsx'

// Real sample footage straight off each rental cam. Photos and clips are
// placeholders from the travel library for now — swap in real files as
// they come home with renters:
//   photos: public/photos/...        (via CAM_DETAILS shots)
//   clips:  public/videos/samples/<cam>.mp4, then set `clip` below
//   360:    public/videos/sample-360.mp4 (any Insta360 .lrv renamed to .mp4)
const CLIPS = {
  // 'GoPro Hero 13': '/videos/samples/gopro.mp4',
}

export default function TestCams() {
  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">Try before you fly</span>
          <h1 className="band__title">Test the cams</h1>
          <p className="band__blurb">
            Every camera on the shelf, proven in the wild — real photos, real
            clips, zero marketing footage. What you see is what you shoot.
          </p>
        </div>
      </header>

      <section className="band band--white">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow eyebrow--blue">Shot on the Insta360</span>
            <h2 className="band__title">The 360° playground</h2>
            <p className="band__blurb">
              This is the actual file off the cam — no stitching app, no
              editing. Grab it and spin.
            </p>
          </div>
          <Video360
            src="/videos/sample-360.mp4"
            projection="dfisheye"
            label="360 degree sample video from the Insta360 — drag to look around"
          />
          <p className="v360__caption">
            night market run · shot on the Insta360 · drag it — go on
          </p>
        </div>
      </section>

      <section className="band band--cream">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow">The contact sheets</span>
            <h2 className="band__title">Every cam, field-tested</h2>
            <p className="band__blurb">
              Three frames and a clip per camera, straight from renters'
              cards and rolls.
            </p>
          </div>

          <div className="testcams">
            {CAMERAS.map((cam) => {
              const details = CAM_DETAILS[cam.name]
              const clip = CLIPS[cam.name]
              const is360 = cam.name === 'Insta360'
              return (
                <article key={cam.name} className="testcam">
                  <header className="testcam__head">
                    <h3 className="testcam__name">{cam.name}</h3>
                    <span className="testcam__tag">{cam.tag}</span>
                    <Link to="/gears" className="testcam__rent">
                      rent it · ₱{cam.price}/day →
                    </Link>
                  </header>
                  <div className="testcam__media">
                    {details.shots.map((shot) => (
                      <figure key={shot.src + shot.cap} className="testcam__shot">
                        <img src={shot.src} alt={shot.cap} loading="lazy" />
                        <figcaption>{shot.cap}</figcaption>
                      </figure>
                    ))}
                    {is360 ? (
                      <a href="#top" className="testcam__clipbox testcam__clipbox--link"
                        onClick={(e) => {
                          e.preventDefault()
                          document.querySelector('.v360')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }}
                      >
                        <span className="testcam__clipicon" aria-hidden="true">🌀</span>
                        <span>that's this cam spinning up top ↑</span>
                      </a>
                    ) : clip ? (
                      <video
                        className="testcam__clip"
                        src={clip}
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <div className="testcam__clipbox" aria-label="Sample clip coming soon">
                        <span className="testcam__clipicon" aria-hidden="true">▶</span>
                        <span>sample clip · still developing ✦</span>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          <p className="testcams__note">
            Shot something great on a rental? DM it to{' '}
            <a href="https://instagram.com/thesnappynomad" target="_blank" rel="noreferrer">
              @thesnappynomad
            </a>{' '}
            and it might end up on this page. 📬
          </p>
        </div>
      </section>
    </main>
  )
}
