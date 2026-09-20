import { Mascot } from '../shared.jsx'

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
              <a href="#" className="storebadge" onClick={(e) => e.preventDefault()}>
                <small>Soon on the</small>
                <span> App Store</span>
              </a>
              <a href="#" className="storebadge" onClick={(e) => e.preventDefault()}>
                <small>Soon on</small>
                <span>▶ Google Play</span>
              </a>
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
    </main>
  )
}
