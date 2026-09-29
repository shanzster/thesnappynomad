import { useEffect, useState } from 'react'
import { CAMERAS } from '../shared.jsx'

// Per-camera rental sheet: sample shots (from our travel library), what's
// in the bag, and the fine print. Keyed by camera name from shared.jsx.
const CAM_DETAILS = {
  'Instax Mini 11': {
    shots: [
      { src: '/photos/manila.jpg', cap: 'manila side streets' },
      { src: '/photos/vigan.jpg', cap: 'calle crisologo, vigan' },
      { src: '/photos/bohol.jpg', cap: 'chocolate hills, bohol' },
    ],
    includes: ['1 pack of Instax film (10 shots)', 'Padded travel case', 'Fresh AA batteries', 'Wrist strap'],
    deposit: 1000,
    notes: 'Extra film packs available at pickup (₱499/pack of 10).',
  },
  'Kodak Charmera': {
    shots: [
      { src: '/photos/sagada.jpg', cap: 'sea of clouds, sagada' },
      { src: '/photos/vigan.jpg', cap: 'calle crisologo, vigan' },
      { src: '/photos/batanes.jpg', cap: 'rolling hills, batanes' },
    ],
    includes: ['1 roll SNAPPYCHROME 200 (36 exp.)', 'Free developing + high-res scans', 'Padded travel case', 'Wrist strap'],
    deposit: 1500,
    notes: 'Scans land in your app (or inbox) 2–3 days after return.',
  },
  'Canon EOS M10': {
    shots: [
      { src: '/photos/cebu.jpg', cap: 'kawasan falls, cebu' },
      { src: '/photos/manila.jpg', cap: 'manila side streets' },
      { src: '/photos/davao.jpg', cap: 'durian run, davao' },
    ],
    includes: ['15-45mm kit lens', '32GB SD card', '2 batteries + charger', 'Padded travel case'],
    deposit: 3000,
    notes: 'Flip screen = selfie machine. Shoots crisp 1080p video too.',
  },
  'GoPro Hero 13': {
    shots: [
      { src: '/photos/siargao.jpg', cap: 'cloud 9, siargao' },
      { src: '/photos/cebu.jpg', cap: 'kawasan falls, cebu' },
      { src: '/photos/coron.jpg', cap: 'hidden lagoon, coron' },
    ],
    includes: ['Waterproof housing', 'Head + chest mounts', '2 batteries + charger', '64GB microSD card'],
    deposit: 3000,
    notes: 'Waterproof to 10m out of the box — dunk away.',
  },
  'Insta360': {
    shots: [
      { src: '/photos/siargao.jpg', cap: 'cloud 9, siargao' },
      { src: '/photos/el-nido.jpg', cap: 'big lagoon, el nido' },
      { src: '/photos/coron.jpg', cap: 'hidden lagoon, coron' },
    ],
    includes: ['Invisible selfie stick', '2 batteries + charger', '64GB microSD card', 'Lens guards'],
    deposit: 3500,
    notes: 'Shoot everything in 360°, frame it later in the free app.',
  },
  'Canon EOS Rebel T6': {
    shots: [
      { src: '/photos/el-nido.jpg', cap: 'big lagoon, el nido' },
      { src: '/photos/batanes.jpg', cap: 'rolling hills, batanes' },
      { src: '/photos/bohol.jpg', cap: 'chocolate hills, bohol' },
    ],
    includes: ['18-55mm kit lens', '32GB SD card', '2 batteries + charger', 'Padded shoulder bag'],
    deposit: 3000,
    notes: 'Our best seller — golden-hour everything. Ask about the 50mm add-on.',
  },
  'Olympus FE-4000': {
    shots: [
      { src: '/photos/davao.jpg', cap: 'durian run, davao' },
      { src: '/photos/manila.jpg', cap: 'manila side streets' },
      { src: '/photos/bohol.jpg', cap: 'chocolate hills, bohol' },
    ],
    includes: ['4GB xD card (very Y2K)', 'Charger', 'Wrist strap', 'Padded pouch'],
    deposit: 1000,
    notes: 'Flash always on. That IS the look.',
  },
}

const RENT_STEPS = [
  'Pick your dates and DM us on Instagram or Facebook to reserve.',
  'Pay a small deposit — refunded in full when the cam comes home safe.',
  'Pick up at the Manila kiosk, or same-day courier within Metro Manila.',
  '3+ day trips get the nomad discount — 15% off the daily rate.',
]

function CamSheet({ cam, onClose }) {
  const details = CAM_DETAILS[cam.name]
  const [shot, setShot] = useState(0)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="camsheet"
      role="dialog"
      aria-modal="true"
      aria-label={cam.name}
      onClick={onClose}
    >
      <div className="camsheet__card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="camsheet__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="camsheet__shots">
          <div className="camsheet__main">
            <img
              key={details.shots[shot].src}
              src={details.shots[shot].src}
              alt={details.shots[shot].cap}
            />
            <span className="camsheet__shotcap">{details.shots[shot].cap} · shot on this cam</span>
          </div>
          <div className="camsheet__thumbs">
            {details.shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={i === shot ? 'camsheet__thumb camsheet__thumb--on' : 'camsheet__thumb'}
                onClick={() => setShot(i)}
                aria-label={`Sample shot: ${s.cap}`}
              >
                <img src={s.src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="camsheet__info">
          <span className="camsheet__tag">{cam.tag}</span>
          <h2 className="camsheet__name">{cam.name}</h2>
          <p className="camsheet__blurb">{cam.blurb}</p>

          <div className="camsheet__pricing">
            <span className="camsheet__price">₱{cam.price}<small>/day</small></span>
            <span className="camsheet__deposit">₱{details.deposit.toLocaleString()} refundable deposit</span>
          </div>

          <h3 className="camsheet__h">In the bag</h3>
          <ul className="camsheet__list">
            {details.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="camsheet__h">How renting works</h3>
          <ol className="camsheet__list camsheet__list--steps">
            {RENT_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <p className="camsheet__note">{details.notes}</p>

          <div className="camsheet__actions">
            <a
              href="https://instagram.com/thesnappynomad"
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary"
            >
              Rent this cam · DM us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Gears() {
  const [selected, setSelected] = useState(null)

  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">The full kit</span>
          <h1 className="band__title">Gears</h1>
          <p className="band__blurb">
            Every camera we rent, what it's for, and what it costs per day.
            Tap a cam for sample shots and the full rental rundown.
          </p>
        </div>
      </header>

      <section className="band band--cream">
        <div className="container">
          <div className="camgrid">
            {CAMERAS.map((cam) => (
              <button
                key={cam.name}
                type="button"
                className="camcard"
                onClick={() => setSelected(cam)}
              >
                <span className="camcard__photo">
                  {cam.img ? <img src={cam.img} alt="" /> : <span aria-hidden="true">{cam.emoji}</span>}
                </span>
                <span className="camcard__tag">{cam.tag}</span>
                <span className="camcard__name">{cam.name}</span>
                <span className="camcard__blurb">{cam.blurb}</span>
                <span className="camcard__foot">
                  <span className="camcard__price">₱{cam.price}<small>/day</small></span>
                  <span className="camcard__cta">view details ✦</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && <CamSheet cam={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
