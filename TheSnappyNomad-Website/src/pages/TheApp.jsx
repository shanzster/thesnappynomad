import { Mascot } from '../shared.jsx'

// The film round trip, from shutter press to scans in the app
const PIPELINE = [
  {
    emoji: '🎞️',
    title: 'Shoot the roll',
    copy: 'Film, digicam, or DSLR — fill the card, finish the roll. No rationing shots.',
  },
  {
    emoji: '📦',
    title: 'Send the cam home',
    copy: "Return label's already in the case. Metro Manila courier picks up same-day.",
  },
  {
    emoji: '🧪',
    title: 'We develop + scan',
    copy: 'Every roll developed, scanned, and backed up in-house within 48 hours.',
  },
  {
    emoji: '📲',
    title: 'Scans hit your app',
    copy: 'Polaroid-framed, pinned to your snap map, ready to share (or gatekeep).',
  },
]

// Passport stamps you earn by shooting a destination — a few are locked
// on purpose; that's the whole fun
const STAMPS = [
  { place: 'MNL', small: '✈ arrived', cls: 'stamp--circle' },
  { place: 'EL NIDO', small: 'palawan', cls: 'stamp--rect' },
  { place: 'SIARGAO', small: 'surf check', cls: 'stamp--oval' },
  { place: 'CEBU', small: 'kawasan', cls: 'stamp--rect stamp--blue' },
  { place: 'BOHOL', small: 'chocolate hills', cls: 'stamp--circle stamp--blue' },
  { place: 'SAGADA', small: 'sea of clouds', cls: 'stamp--oval stamp--red' },
  { place: 'BATANES', small: 'locked · go north', cls: 'stamp--circle', locked: true },
  { place: 'CORON', small: 'locked · dive it', cls: 'stamp--rect', locked: true },
  { place: 'DAVAO', small: 'locked · durian dare', cls: 'stamp--oval', locked: true },
]

const FEATURES = [
  {
    emoji: '🗓️',
    title: 'Book in three taps',
    copy: 'Pick a cam, pick your dates, pay. Your rental lives on one screen with pickup details and countdowns.',
  },
  {
    emoji: '🎞️',
    title: 'Your scans, delivered',
    copy: 'Film rentals come back as high-res scans straight into the app — polaroid-framed, ready to share.',
  },
  {
    emoji: '📍',
    title: 'Snap map',
    copy: 'Every shot pinned to where you took it. Your trip becomes a map of little polaroids.',
  },
  {
    emoji: '🏅',
    title: 'Stamp collection',
    copy: 'Earn passport stamps for every destination you shoot. Batanes stamp holders get bragging rights forever.',
  },
]

export default function TheApp() {
  return (
    <main className="page">
      <section className="band band--cream apphero">
        <div className="container apphero__inner">
          <div className="apphero__copy">
            <span className="eyebrow">The Snappy Nomad app</span>
            <h1 className="band__title">Your trip, in your pocket</h1>
            <p className="band__blurb">
              Rent cams, track your bookings, and get your shots back — all in
              one warm little app. Same family as the website, softer around
              the edges.
            </p>
            <div className="apphero__stores">
              <div className="storebadge storebadge--soon">
                <small>Soon on the</small>
                <span> App Store</span>
              </div>
              <div className="storebadge storebadge--soon">
                <small>Soon on</small>
                <span>▶ Google Play</span>
              </div>
            </div>
          </div>

          <div className="phone" aria-hidden="true">
            <div className="phone__screen">
              <div className="phone__status">9:41</div>
              <div className="phone__greeting">
                <Mascot className="phone__mascot" />
                <div>
                  <strong>Kumusta, Nomad!</strong>
                  <small>Your Instax is due in 3 days</small>
                </div>
              </div>
              <div className="phone__card phone__card--booking">
                <span className="phone__card-label">CURRENT RENTAL</span>
                <strong>Instax Mini 11</strong>
                <small>El Nido · Mar 12–19</small>
              </div>
              <div className="phone__card phone__card--scans">
                <span className="phone__card-label">FRESH SCANS</span>
                <div className="phone__scanrow">
                  <span>🏝️</span><span>🌅</span><span>🛺</span>
                </div>
              </div>
              <div className="phone__nav">
                <span>📷</span><span>🗺️</span><span>🎞️</span><span>👤</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow eyebrow--blue">Why you'll like it</span>
            <h2 className="band__title">Made for the road</h2>
          </div>
          <div className="features">
            {FEATURES.map((f) => (
              <article key={f.title} className="feature">
                <span className="feature__emoji" aria-hidden="true">{f.emoji}</span>
                <h3 className="feature__title">{f.title}</h3>
                <p className="feature__copy">{f.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--cream">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow">The film round trip</span>
            <h2 className="band__title">From shutter to scan</h2>
            <p className="band__blurb">
              Your shots never sit in a lab queue wondering where home is.
            </p>
          </div>
          <ol className="how">
            {PIPELINE.map((step, i) => (
              <li key={step.title} className="howstep">
                <span className="howstep__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="howstep__emoji" aria-hidden="true">{step.emoji}</span>
                <h3 className="howstep__title">{step.title}</h3>
                <p className="howstep__copy">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow eyebrow--blue">Collect the map</span>
            <h2 className="band__title">The stamp collection</h2>
            <p className="band__blurb">
              Shoot a destination, earn its stamp. Some you'll have to go get.
            </p>
          </div>
          <div className="stampwall">
            {STAMPS.map((s) => (
              <div
                key={s.place}
                className={`stamp ${s.cls}${s.locked ? ' stamp--locked' : ''}`}
              >
                {s.place}
                <small>{s.small}</small>
              </div>
            ))}
          </div>
          <p className="stampwall__note">
            6 of 10 collected — the batanes stamp is the flex ✈
          </p>
        </div>
      </section>

      <section className="band appwaitlist">
        <div className="container appwaitlist__inner">
          <Mascot className="appwaitlist__mascot" />
          <h2 className="band__title appwaitlist__title">Be first through the gate</h2>
          <p className="band__blurb appwaitlist__blurb">
            The app is boarding soon. DM us "APP" and we'll save you a seat —
            early nomads get their first stamp free.
          </p>
          <a
            href="https://instagram.com/thesnappynomad"
            target="_blank"
            rel="noreferrer"
            className="btn btn--secondary"
          >
            DM @thesnappynomad ↗
          </a>
        </div>
      </section>
    </main>
  )
}
