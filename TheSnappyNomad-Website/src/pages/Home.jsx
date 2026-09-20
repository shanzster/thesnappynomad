import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mascot,
  useTick,
  StampCycler,
  PolaroidCycler,
  PostcardFront,
  GearLuggage,
  PHOTO_PLACEHOLDERS,
  PHOTO_IMAGES,
} from '../shared.jsx'

// Same order as PHOTO_IMAGES so each postcard's stamp matches its photo
const PLACES = [
  { place: 'Manila', emoji: '🛺' },
  { place: 'El Nido', emoji: '🏝️' },
  { place: 'Siargao', emoji: '🏄' },
  { place: 'Cebu', emoji: '🌊' },
  { place: 'Bohol', emoji: '⛰️' },
  { place: 'Vigan', emoji: '🏘️' },
  { place: 'Sagada', emoji: '☁️' },
  { place: 'Batanes', emoji: '🌾' },
  { place: 'Coron', emoji: '🤿' },
  { place: 'Davao', emoji: '🍈' },
]

const CARD_TILTS = ['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg']

// Marquee that keeps the curved-arc composition: the track scrolls right
// forever while every card's height + tilt follow an arch based on where it
// currently is on screen (high in the middle, dipping outward at the edges).
const ARC_DROP = 130 // px the cards sink at the screen edges
const ARC_TILT = 16 // deg of outward lean at the screen edges
const SPEED = 55 // px per second, rightward

function useArcMarquee(trackRef) {
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let offset = 0
    let paused = false
    let raf
    let last = performance.now()

    const wrap = track.parentElement
    const onEnter = () => { paused = true }
    const onLeave = () => { paused = false }
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const half = track.scrollWidth / 2
      if (half > 0) {
        if (!paused) offset = (offset + SPEED * dt) % half
        track.style.transform = `translateX(${offset - half}px)`

        const cx = window.innerWidth / 2
        for (const item of track.children) {
          const rect = item.getBoundingClientRect()
          const t = (rect.left + rect.width / 2 - cx) / cx // -1 left … 1 right
          const clamped = Math.max(-1.15, Math.min(1.15, t))
          const y = clamped * clamped * ARC_DROP
          const rot = clamped * ARC_TILT
          item.style.transform = `translateY(${y}px) rotate(${rot}deg)`
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [trackRef])
}

function Hero() {
  const step = useTick(200)
  return (
    <header className="hero" id="top">
      <div className="hero__video-fallback" aria-hidden="true" />
      <video className="hero__video" autoPlay muted loop playsInline>
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__stage">
          <div className="passport" aria-label="Open passport scrapbook">
            <img src="/images/passport-open.png" alt="" className="passport__img" />
            <div className="passport__overlay passport__overlay--left">
              <PolaroidCycler step={step} />
            </div>
            <div className="passport__overlay passport__overlay--right">
              <div className="stampcycler" aria-hidden="true">
                <StampCycler step={step} />
              </div>
              <p className="passport__note">wander often, develop later ✈</p>
            </div>
          </div>

          <Mascot className="float-sticker float-sticker--mascot" />
          <div className="float-sticker float-sticker--snap" aria-hidden="true">
            SNAP!
          </div>
          <div className="float-sticker float-sticker--ticket" aria-hidden="true">
            <span>BOARDING PASS</span>
            <strong>TSN ✈ 2026 · SEAT 10B</strong>
          </div>
        </div>

        <div className="hero__copy">
          <h1 className="hero__sub">
            Rent the perfect travel camera — film, digicam, action, or DSLR —
            packed, charged, and ready for your next adventure.
          </h1>
          <div className="hero__actions">
            <Link to="/gears" className="btn btn--primary">Browse the gear</Link>
            <a href="#how" className="btn btn--secondary">How it works</a>
          </div>
        </div>
      </div>
    </header>
  )
}

function Gear() {
  return (
    <section className="band gearband" id="gear">
      <div className="container">
        <div className="band__head">
          <span className="eyebrow">What's inside the luggage?</span>
          <h2 className="band__title">The Gear Shelf</h2>
          <p className="band__blurb">
            Every cam in our kit, ready to travel. Prices are per day —
            multi-day trips get the nomad discount.
          </p>
        </div>
        <GearLuggage />
        <p className="band__more">
          <Link to="/gears" className="btn btn--secondary">See every cam →</Link>
        </p>
      </div>
    </section>
  )
}

function PostcardsMarquee() {
  const trackRef = useRef(null)
  useArcMarquee(trackRef)

  const cards = PLACES.map((p, i) => {
    const real = PHOTO_IMAGES[i % (PHOTO_IMAGES.length || 1)]
    const fallback = PHOTO_PLACEHOLDERS[i % PHOTO_PLACEHOLDERS.length]
    const photo = PHOTO_IMAGES.length
      ? { img: real.src, caption: real.caption, emoji: p.emoji }
      : { ...fallback, emoji: p.emoji }
    return { photo, place: p.place }
  })

  return (
    <section className="band band--cream postcards" id="journal">
      <div className="container band__head">
        <span className="eyebrow">Postcards from the road</span>
        <h2 className="band__title">Shot on our cams</h2>
        <p className="band__blurb">
          Every rental comes home with stories. Film grain, digicam flash,
          drone sweeps — all shot by nomads like you.
        </p>
      </div>
      <div className="pcmarquee" aria-hidden="true">
        <div className="pcmarquee__track" ref={trackRef}>
          {[...cards, ...cards].map((card, i) => (
            <div key={i} className="pcmarquee__item">
              <PostcardFront
                photo={card.photo}
                place={card.place}
                rot={CARD_TILTS[i % CARD_TILTS.length]}
              />
            </div>
          ))}
        </div>
      </div>
      <p className="band__more">
        <Link to="/postcards" className="btn btn--primary">Read the postcards</Link>
      </p>
    </section>
  )
}

// Editorial film-cameras spotlight, matched to the FILMCOM reference:
// blue panel inset on cream, mini serif nav bar, ALL-CAPS cream headline,
// four overlapping prints of mixed sizes/aspects with blue visible below.
const FILM_PRINTS = [
  { src: '/photos/film/film-1.jpg', rot: '-8deg', y: '36px', w: 'clamp(210px, 25vw, 370px)', ar: '3 / 4', z: 1, ml: '0' },
  { src: '/photos/film/film-2.jpg', rot: '-4deg', y: '58px', w: 'clamp(190px, 23vw, 340px)', ar: '3 / 4', z: 2, ml: 'clamp(-64px, -3.6vw, -36px)' },
  { src: '/photos/film/film-3.jpg', rot: '2deg', y: '-34px', w: 'clamp(200px, 24vw, 355px)', ar: '4 / 5', z: 4, ml: 'clamp(-68px, -3.8vw, -40px)' },
  { src: '/photos/film/film-4.jpg', rot: '3deg', y: '20px', w: 'clamp(310px, 37vw, 560px)', ar: '3 / 2', z: 3, ml: 'clamp(-72px, -4vw, -44px)' },
]

function FilmWorld() {
  return (
    <section className="filmworld">
      <h2 className="filmworld__title">
        The Unique World
        <br />
        of Film Cameras
      </h2>
      <p className="filmworld__sub">
        cameras that give photos
        <br />
        a special character and uniqueness
      </p>
      <div className="filmworld__prints" aria-hidden="true">
        {FILM_PRINTS.map((print, i) => (
          <div
            key={i}
            className="filmprint"
            style={{
              '--rot': print.rot,
              '--y': print.y,
              '--w': print.w,
              '--ar': print.ar,
              '--z': print.z,
              marginLeft: print.ml,
            }}
          >
            <img src={print.src} alt="" />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---- The Travel Journal: flippable scrapbook spreads ---- */

const SPREADS = [
  {
    title: 'trip 001 · siargao run',
    items: [
      { type: 'photo', src: '/photos/siargao.jpg', x: '6%', y: '12%', w: '27%', rot: '-4deg', tape: '#ff6b1a', cap: 'cloud 9, 6am' },
      { type: 'photo', src: '/photos/cebu.jpg', x: '26%', y: '48%', w: '22%', rot: '3deg', tape: '#2b3fe0', cap: 'kawasan detour' },
      { type: 'stamp', cls: 'stamp--oval', place: 'SIARGAO', small: 'surf check', x: '58%', y: '10%', rot: '8deg' },
      { type: 'note', text: 'the water was UNREAL.\nshot 3 rolls in 2 days ✈', x: '56%', y: '42%', rot: '-2deg' },
      { type: 'ticket', text: 'CEB ✈ IAO · SEAT 12A · 07:15', x: '57%', y: '68%', rot: '2deg' },
    ],
  },
  {
    title: 'trip 002 · the north loop',
    items: [
      { type: 'photo', src: '/photos/sagada.jpg', x: '7%', y: '14%', w: '28%', rot: '3deg', tape: '#2b3fe0', cap: 'sea of clouds, 5am' },
      { type: 'photo', src: '/photos/vigan.jpg', x: '27%', y: '50%', w: '21%', rot: '-3deg', tape: '#e8401c', cap: 'calle crisologo' },
      { type: 'stamp', cls: 'stamp--oval stamp--red', place: 'SAGADA', small: 'mountain province', x: '57%', y: '12%', rot: '-9deg' },
      { type: 'note', text: 'worth every 4am alarm.\nthe charmera ate this trip up', x: '55%', y: '44%', rot: '1.5deg' },
      { type: 'ticket', text: 'MNL → VIGAN · NIGHT BUS · 22:00', x: '56%', y: '70%', rot: '-2deg' },
    ],
  },
  {
    title: 'trip 003 · palawan pages',
    items: [
      { type: 'photo', src: '/photos/el-nido.jpg', x: '6%', y: '13%', w: '28%', rot: '-3deg', tape: '#2b3fe0', cap: 'big lagoon!!' },
      { type: 'photo', src: '/photos/coron.jpg', x: '27%', y: '49%', w: '22%', rot: '4deg', tape: '#ff6b1a', cap: 'kayangan lake' },
      { type: 'stamp', cls: 'stamp--rect stamp--blue', place: 'CORON', small: 'shipwreck dive', x: '58%', y: '11%', rot: '5deg' },
      { type: 'note', text: 'note to self: waterproof\nEVERYTHING next time 🌊', x: '55%', y: '43%', rot: '-1.5deg' },
      { type: 'ticket', text: 'TOUR A · BANCA 07 · 08:30', x: '57%', y: '69%', rot: '3deg' },
    ],
  },
]

function Journal() {
  const [page, setPage] = useState(0)
  const [flip, setFlip] = useState(null)

  const go = (dir) => {
    if (flip) return
    const target = page + (dir === 'next' ? 1 : -1)
    if (target < 0 || target >= SPREADS.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPage(target)
      return
    }
    setFlip(dir)
    setTimeout(() => setPage(target), 300)
    setTimeout(() => setFlip(null), 640)
  }

  const spread = SPREADS[page]

  return (
    <section className="journal-band" id="journal-book">
      <div className="container">
        <span className="eyebrow journal-band__eyebrow">Field notes</span>
        <h2 className="journal-band__title">The Travel Journal</h2>
        <p className="journal-band__sub">
          {SPREADS.length} spreads · flip through trips shot on our cams
        </p>

        <div className="journal">
          <div className="journal__deck" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="jbook">
            {spread.items.map((item, i) => {
              if (item.type === 'photo') {
                return (
                  <figure
                    key={i}
                    className="jphoto"
                    style={{ left: item.x, top: item.y, width: item.w, '--rot': item.rot, '--tape': item.tape }}
                  >
                    <img src={item.src} alt="" />
                    <figcaption>{item.cap}</figcaption>
                  </figure>
                )
              }
              if (item.type === 'stamp') {
                return (
                  <div key={i} className="jstamp" style={{ left: item.x, top: item.y, '--rot': item.rot }}>
                    <div className={`stamp ${item.cls}`}>
                      {item.place}
                      <small>{item.small}</small>
                    </div>
                  </div>
                )
              }
              if (item.type === 'ticket') {
                return (
                  <span key={i} className="jticket" style={{ left: item.x, top: item.y, '--rot': item.rot }}>
                    {item.text}
                  </span>
                )
              }
              return (
                <p key={i} className="jnote" style={{ left: item.x, top: item.y, '--rot': item.rot }}>
                  {item.text}
                </p>
              )
            })}

            <span className="jbook__label">{spread.title}</span>
            <div className="jbook__spine" aria-hidden="true" />
            {flip && <div className={`jbook__turn jbook__turn--${flip}`} aria-hidden="true" />}

            <button
              type="button"
              className="jbook__nav jbook__nav--prev"
              onClick={() => go('prev')}
              disabled={page === 0}
              aria-label="Previous spread"
            >
              ‹
            </button>
            <button
              type="button"
              className="jbook__nav jbook__nav--next"
              onClick={() => go('next')}
              disabled={page === SPREADS.length - 1}
              aria-label="Next spread"
            >
              ›
            </button>
          </div>

          <div className="journal__dots" aria-hidden="true">
            {SPREADS.map((s, i) => (
              <span key={s.title} className={i === page ? 'journal__dot journal__dot--on' : 'journal__dot'} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- Trip Kits: bundles as boarding passes ---- */

// Add your edited tote images via img: '/images/kits/island-hopper.png' etc.
// Until then each card shows a CSS placeholder tote.
const KITS = [
  {
    name: 'Island Hopper',
    trip: 'beach trips & island hopping',
    items: ['GoPro Hero 13', 'Instax Mini 11', 'dry bag + film pack'],
    price: 799,
    save: 149,
    rot: '-1.2deg',
    emoji: '🏝️',
  },
  {
    name: 'City Wanderer',
    trip: 'street food runs & old towns',
    items: ['Olympus FE-4000', 'Kodak Charmera', 'extra film rolls'],
    price: 499,
    save: 129,
    rot: '0.8deg',
    emoji: '🛺',
  },
  {
    name: 'The Full Nomad',
    trip: 'the everything trip',
    items: ['Canon EOS Rebel T6', 'Insta360', 'Instax Mini 11'],
    price: 1299,
    save: 198,
    rot: '-0.8deg',
    emoji: '🌏',
  },
]

function TripKits() {
  return (
    <section className="band band--cream" id="kits">
      <div className="container">
        <div className="band__head">
          <span className="eyebrow">Bundled, packed, ready</span>
          <h2 className="band__title">The travel kit you never knew you needed</h2>
          <p className="band__blurb">
            Curated cam combos in one tote, one bundled rate — cheaper than
            renting solo.
          </p>
        </div>
        <div className="kits">
          {KITS.map((kit) => (
            <article key={kit.name} className="kitcard" style={{ '--rot': kit.rot }}>
              {kit.img ? (
                <img src={kit.img} alt="" className="kitcard__tote-img" />
              ) : (
                <div className="kitcard__tote" aria-hidden="true">
                  <span className="kitcard__tote-emoji">{kit.emoji}</span>
                  <span className="kitcard__tote-note">tote incoming ✦</span>
                </div>
              )}
              <h3 className="kitcard__name">{kit.name}</h3>
              <p className="kitcard__trip">for {kit.trip}</p>
              <ul className="kitcard__items">
                {kit.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="kitcard__pricerow">
                <strong className="kitcard__price">
                  ₱{kit.price}
                  <small>/day</small>
                </strong>
                <span className="kitcard__save">save ₱{kit.save}</span>
              </div>
              <button type="button" className="btn btn--primary kitcard__btn">
                Book kit
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- FAQ as luggage tags ---- */

const FAQS = [
  {
    q: 'What if I break or lose a cam?',
    a: 'Your deposit covers minor dings — sand happens, we get it. Bigger damage is charged at a capped repair fee, never full price out of nowhere. Just tell us what happened; honesty gets discounts.',
  },
  {
    q: 'Is there a deposit?',
    a: 'Yes, a refundable one — it scales with the camera (film compacts are small, DSLRs a bit more). It bounces back to you within 24 hours of the cam coming home safe.',
  },
  {
    q: 'Do you ship?',
    a: 'Metro Manila gets same-day courier. Everywhere else in the Philippines ships next-day. Return shipping labels are included in the case.',
  },
  {
    q: 'Who develops my film?',
    a: 'We do. Drop the cam back with the roll inside and we develop, scan, and send high-res scans to your app within 48 hours. Negatives are yours if you want them.',
  },
  {
    q: 'Can I extend my rental mid-trip?',
    a: 'One tap in the app, or just message us. As long as the cam is not booked right after you, extensions are automatic at the same daily rate.',
  },
  {
    q: 'Are batteries and memory cards included?',
    a: 'Always. Every cam ships fully charged with a 64GB card (or a film starter pack), a strap, and a case. Zero surprise add-ons.',
  },
]

function Faq() {
  const [open, setOpen] = useState(null)

  return (
    <section className="band band--white" id="faq">
      <div className="container">
        <div className="band__head">
          <span className="eyebrow eyebrow--blue">Before you fly</span>
          <h2 className="band__title">The departures board</h2>
          <p className="band__blurb">
            Every question, cleared for takeoff — tap a row.
          </p>
        </div>
        <div className="faq__grid">
          <div className="depboard">
            <div className="depboard__head" aria-hidden="true">
            <span>flight</span>
            <span>question</span>
            <span>status</span>
          </div>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={faq.q} className={isOpen ? 'deprow deprow--open' : 'deprow'}>
                <button
                  type="button"
                  className="deprow__row"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="deprow__code">SN·{String(i + 1).padStart(2, '0')}</span>
                  <span className="deprow__q">{faq.q}</span>
                  <span className="deprow__status" key={isOpen ? 'open' : 'closed'}>
                    {isOpen ? 'answered' : 'boarding'}
                  </span>
                </button>
                {isOpen && (
                  <div className="deprow__answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
            <div className="depboard__foot" aria-hidden="true">
              <span className="depboard__dot" /> all cams on time · no delays since 2024
            </div>
          </div>
          <div className="faq__plane" aria-hidden="true">
            <img src="/images/plane.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- App teaser band ---- */

function AppTeaser() {
  return (
    <section className="appteaser">
      <div className="container appteaser__inner">
        <div className="appteaser__copy">
          <span className="eyebrow appteaser__eyebrow">The Snappy Nomad app</span>
          <h2 className="appteaser__title">Your rental + your scans, one app</h2>
          <p className="appteaser__blurb">
            Book cams, track returns, and get your film back as
            polaroid-framed scans — right on your phone.
          </p>
          <Link to="/app" className="btn btn--secondary">See the app →</Link>
        </div>
        <div className="appteaser__phone" aria-hidden="true">
          <div className="miniphone">
            <div className="miniphone__screen">
              <Mascot className="miniphone__mascot" />
              <strong>Kumusta, Nomad!</strong>
              <div className="miniphone__card">
                <span>CURRENT RENTAL</span>
                Instax Mini 11
              </div>
              <div className="miniphone__card miniphone__card--light">
                <span>FRESH SCANS</span>
                🏝️ 🌅 🛺
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- Instagram strip ---- */

function IgStrip() {
  return (
    <section className="band band--white igstrip">
      <div className="container">
        <div className="igstrip__row" aria-hidden="true">
          {PHOTO_IMAGES.slice(0, 6).map((photo, i) => (
            <img
              key={photo.src}
              src={photo.src}
              alt=""
              style={{ '--rot': `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }}
            />
          ))}
        </div>
        <p className="band__more">
          <a
            href="https://instagram.com/thesnappynomad"
            target="_blank"
            rel="noreferrer"
            className="btn btn--secondary"
          >
            follow @thesnappynomad ↗
          </a>
        </p>
      </div>
    </section>
  )
}

/* ---- Closing CTA + postcard newsletter ---- */

function ClosingCta() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <section className="band band--cream closing">
      <div className="container closing__inner">
        <Mascot className="closing__mascot" />
        <h2 className="closing__title">Ready to snap?</h2>
        <p className="band__blurb">
          Grab a cam, catch a flight, and come home with a passport full of
          stories.
        </p>
        <Link to="/gears" className="btn btn--primary closing__btn">
          Browse the gear
        </Link>

        <form
          className="mailform"
          onSubmit={(e) => {
            e.preventDefault()
            if (email) setSent(true)
          }}
        >
          <header className="mailform__head">
            <span className="mailform__title">Post Card</span>
            <span className="mailform__sub">film deals · new cams · no spam</span>
          </header>
          <div className="mailform__body">
            <p className="mailform__msg">
              Send me film deals, new cams, and the occasional mascot selfie. ✈
            </p>
            <div className="mailform__divider" aria-hidden="true" />
            <div className="mailform__addr">
              {sent ? (
                <p className="mailform__done">stamped! check your inbox ✦</p>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                  />
                  <button type="submit" className="mailform__stamp">
                    SEND
                    <small>✈ PHL</small>
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <div className="divider" />
      <Gear />
      <FilmWorld />
      <div className="divider divider--tilt" />
      <PostcardsMarquee />
      <Journal />
      <TripKits />
      <Faq />
      <AppTeaser />
      <IgStrip />
      <div className="divider" />
      <ClosingCta />
    </>
  )
}
