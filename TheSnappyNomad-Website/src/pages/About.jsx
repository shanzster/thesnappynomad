import { Mascot, PHOTO_PLACEHOLDERS } from '../shared.jsx'

const CHAPTERS = [
  {
    year: '2024',
    title: 'One camera, borrowed',
    copy: 'It started with lending a digicam to a friend flying to Siargao. It came back full of the best photos we had ever seen — and a little sand.',
  },
  {
    year: '2025',
    title: 'The kiosk era',
    copy: 'A folding table, five cameras, and a laminated price list. The mascot got drawn on the back of a boarding pass somewhere over Cebu.',
  },
  {
    year: '2026',
    title: 'Snap · Pose · Wander',
    copy: 'A full shelf of film, digicam, action and DSLR gear — plus the app, so your rental and your shots live in one place.',
  },
]

export default function About() {
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
        <div className="container filmstory">
          <div className="filmstrip" aria-hidden="true">
            {PHOTO_PLACEHOLDERS.slice(0, 5).map((p, i) => (
              <div key={i} className="filmstrip__frame" style={{ background: p.bg }}>
                <span>{p.emoji}</span>
              </div>
            ))}
            <div className="filmstrip__canister">
              <span>SNAPPYCHROME</span>
              <small>200 · 36 exp.</small>
            </div>
          </div>

          <div className="filmstory__chapters">
            {CHAPTERS.map((ch) => (
              <article key={ch.year} className="chapter">
                <span className="chapter__year">{ch.year}</span>
                <h2 className="chapter__title">{ch.title}</h2>
                <p className="chapter__copy">{ch.copy}</p>
              </article>
            ))}
            <div className="chapter chapter--sign">
              <Mascot className="chapter__mascot" />
              <p className="chapter__copy">
                The little kiosk face is still on every camera we send out.
                Bring it somewhere nice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
