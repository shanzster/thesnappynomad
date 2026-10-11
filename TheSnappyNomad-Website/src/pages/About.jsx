import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Mascot, playShutterSound } from '../shared.jsx'
import { useDialogA11y } from '../a11y.js'

// The story, one polaroid camera per chapter. Press the shutter: the
// print ejects from the slot, flies up, and lands as a polaroid modal
// where the photo develops and the story fades in.
const CHAPTERS = [
  {
    year: '2024',
    cls: 'polacam--one',
    title: 'One camera, borrowed',
    photo: { src: '/photos/siargao.jpg', cap: 'the roll that started everything' },
    story: [
      "It started with a dented digicam and a friend with a 6am flight to Siargao. She didn't want to risk her phone in the surf, so we handed the camera over — half expecting to never see it again. It came back a week later with 800 photos, a little sand in the battery door, and the best pictures we had ever seen.",
      "Word got around. The second borrower paid in coffee. The third one asked, \"how much to rent it?\" — and we didn't have an answer, so we made one up on a napkin. That napkin was our first price list.",
      'The lesson stuck: nobody wants to own a camera for fifty-one weeks a year. They want the right one — charged, loaded, ready — for the one week that matters.',
    ],
  },
  {
    year: '2025',
    cls: 'polacam--two',
    title: 'The kiosk era',
    photo: { src: '/photos/vigan.jpg', cap: 'the five-camera shelf, week two' },
    story: [
      'A folding table at a Manila weekend market. Five cameras, a laminated price list, and a biscuit tin for deposits. We rented out every single cam, every single weekend, for a month straight — and the biscuit tin got upgraded to a cash box with a lock.',
      "Somewhere over Cebu, on a delayed flight, the mascot got doodled on the back of a boarding pass: a little kiosk with a face. He's been on every camera, case, and sticker we've sent out since.",
      "That was also the year we started developing film ourselves. A lab misplaced a renter's honeymoon roll — never again. Now every roll is developed, scanned, and backed up in-house, by the same hands that packed the camera.",
    ],
  },
  {
    year: '2026',
    cls: 'polacam--three',
    title: 'Snap · Pose · Wander',
    photo: { src: '/photos/batanes.jpg', cap: 'north of north, shot by a renter' },
    story: [
      'Today the shelf runs the whole range: instant film, Y2K digicams, action cams, 360s, and the DSLR that never stops getting booked. Trip kits ship in totes. Film comes home and lands in the app as polaroid-framed scans, pinned to the exact beach you shot them on.',
      'The app handles the boring parts — bookings, returns, mid-trip extensions — so the trip stays about the trip. And the passport stamps? People genuinely fight over the Batanes one.',
      'The little kiosk face is still on every camera we send out. Bring it somewhere nice.',
    ],
  },
]

function PolaroidModal({ chapter, from, onClose }) {
  const cardRef = useRef(null)
  useDialogA11y(cardRef, onClose)

  // start the flight from the camera's slot, land in the center
  const style = from
    ? {
        '--fx': `${from.x - window.innerWidth / 2}px`,
        '--fy': `${from.y - window.innerHeight / 2}px`,
      }
    : undefined

  return createPortal(
    <div
      className="polamodal"
      role="dialog"
      aria-modal="true"
      aria-label={`${chapter.year} — ${chapter.title}`}
      onClick={onClose}
    >
      <article
        className="polamodal__card"
        ref={cardRef}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="polamodal__close"
          onClick={onClose}
          aria-label="Close story"
        >
          ×
        </button>
        <div className="polamodal__photo">
          <img src={chapter.photo.src} alt="" />
        </div>
        <p className="polamodal__cap">{chapter.photo.cap}</p>
        <div className="polamodal__story">
          <div className="polamodal__headrow">
            <span className="polamodal__year">{chapter.year}</span>
            <h2 className="polamodal__title">{chapter.title}</h2>
          </div>
          {chapter.story.map((p) => (
            <p key={p.slice(0, 24)} className="polamodal__copy">{p}</p>
          ))}
        </div>
      </article>
    </div>,
    document.body
  )
}

function Polacam({ chapter, hint, onOpen }) {
  const [flashing, setFlashing] = useState(false)
  const [ejecting, setEjecting] = useState(false)
  const bodyRef = useRef(null)

  const press = () => {
    if (ejecting) return
    const rect = bodyRef.current?.getBoundingClientRect()
    const slot = rect ? { x: rect.x + rect.width / 2, y: rect.bottom } : null
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onOpen(chapter, null)
      return
    }
    setFlashing(true)
    setEjecting(true)
    playShutterSound()
    setTimeout(() => setFlashing(false), 420)
    setTimeout(() => {
      setEjecting(false)
      onOpen(chapter, slot)
    }, 470)
  }

  return (
    <div className={`polacam ${chapter.cls}`}>
      <div className="polacam__body" ref={bodyRef}>
        {ejecting && <span className="polacam__stub" aria-hidden="true" />}
        <button
          type="button"
          className="polacam__cam"
          onClick={press}
          aria-haspopup="dialog"
          aria-label={`${chapter.year} — ${chapter.title}. Press the shutter to print this chapter.`}
        >
          {flashing && <span className="polacam__flash" aria-hidden="true" />}
          <span className="polacam__top" aria-hidden="true">
            <span className="polacam__viewfinder" />
            <span className="polacam__year">{chapter.year}</span>
            <span className="polacam__flashbox" />
          </span>
          <span className="polacam__mid" aria-hidden="true">
            <span className="polacam__stripe" />
            <span className="polacam__lens"><span /></span>
            <span className="polacam__shutter" />
          </span>
          <span className="polacam__slot" aria-hidden="true" />
        </button>
      </div>
      {hint && (
        <span className="polacam__hint" aria-hidden="true">press the shutter ✦</span>
      )}
    </div>
  )
}

export default function About() {
  const [active, setActive] = useState(null) // { chapter, from }
  const [printed, setPrinted] = useState(false)

  const open = (chapter, from) => {
    setActive({ chapter, from })
    setPrinted(true)
  }

  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">Our story</span>
          <h1 className="band__title">About The Snappy Nomad</h1>
          <p className="band__blurb">
            A travel camera rental brand from the Philippines. We believe the
            best souvenir is a bad photo of a great day.
          </p>
        </div>
      </header>

      <section className="band band--white">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow eyebrow--blue">Three cameras, three chapters</span>
            <p className="band__blurb">
              Every year got its own camera. Press a shutter and the story
              prints itself.
            </p>
          </div>

          <div className="polatimeline">
            {CHAPTERS.map((ch, i) => (
              <Polacam
                key={ch.year}
                chapter={ch}
                hint={i === 0 && !printed}
                onOpen={open}
              />
            ))}
          </div>

          <div className="about-sign">
            <Mascot className="about-sign__mascot" />
            <p className="about-sign__copy">
              Still packed by hand, still developed in-house, still signed by
              the kiosk face himself.
              <span className="about-sign__name">— The Snappy Nomad, Manila</span>
            </p>
          </div>
        </div>
      </section>

      {active && (
        <PolaroidModal
          chapter={active.chapter}
          from={active.from}
          onClose={() => setActive(null)}
        />
      )}
    </main>
  )
}
