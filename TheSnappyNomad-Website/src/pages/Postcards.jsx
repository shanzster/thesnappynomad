import { PostcardBack } from '../shared.jsx'

// Real postcards from renters — swap these with actual submissions
const POSTCARDS = [
  {
    name: 'Bea',
    place: 'SIARGAO',
    stampEmoji: '🌊',
    date: 'MAR 2026',
    message:
      'Rented the GoPro for a week of swells. Salt water everywhere, camera didn’t flinch. The cloud nine barrel clip made my year.',
    rot: '-2deg',
  },
  {
    name: 'Marco',
    place: 'BATANES',
    stampEmoji: '🌾',
    date: 'JAN 2026',
    message:
      'The Instax survived the honesty coffee shops, the hills, and one carabao encounter. Twenty prints, zero regrets.',
    rot: '1.5deg',
  },
  {
    name: 'Cess & Jo',
    place: 'EL NIDO',
    stampEmoji: '🏝️',
    date: 'FEB 2026',
    message:
      'Island hopping with the Rebel T6. Lagoon photos came out unreal. The dry bag you threw in saved our lives on Tour A.',
    rot: '-1deg',
  },
  {
    name: 'Dio',
    place: 'SAGADA',
    stampEmoji: '⛰️',
    date: 'DEC 2025',
    message:
      'Shot the sea of clouds on the Kodak Charmera. Grainy, foggy, perfect. Felt like a memory before it even developed.',
    rot: '2deg',
  },
  {
    name: 'Hana',
    place: 'CEBU',
    stampEmoji: '🐋',
    date: 'APR 2026',
    message:
      'Digicam flash at every lechon stop from Carcar to Talisay. The FE-4000 is pure Y2K magic. Extending my rental, sorry not sorry.',
    rot: '-2.5deg',
  },
  {
    name: 'Ramil',
    place: 'MANILA',
    stampEmoji: '🛺',
    date: 'MAY 2026',
    message:
      'Insta360 on the handlebars through Binondo traffic. Third-person shots of my own ride — how is this even legal.',
    rot: '1deg',
  },
]

export default function Postcards() {
  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">Mail from everywhere</span>
          <h1 className="band__title">Postcards from people</h1>
          <p className="band__blurb">
            Renters send us postcards from wherever the cams end up.
            Here's the mailbox — stamps and all.
          </p>
        </div>
      </header>

      <section className="band band--white">
        <div className="container">
          <div className="mailwall">
            {POSTCARDS.map((card) => (
              <PostcardBack key={card.name} card={card} />
            ))}
          </div>
          <p className="band__more">
            Rented with us? Send yours to{' '}
            <a href="mailto:hello@thesnappynomad.com">hello@thesnappynomad.com</a>{' '}
            — real paper postcards get pinned in the shop. 📮
          </p>
        </div>
      </section>
    </main>
  )
}
