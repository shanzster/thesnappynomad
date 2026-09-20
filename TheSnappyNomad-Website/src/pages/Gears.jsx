import { GearLuggage, CAMERAS } from '../shared.jsx'

export default function Gears() {
  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">The full kit</span>
          <h1 className="band__title">Gears</h1>
          <p className="band__blurb">
            Every camera we rent, what it's for, and what it costs per day.
            Multi-day trips get the nomad discount.
          </p>
        </div>
      </header>

      <section className="band gearband">
        <div className="container">
          <GearLuggage />
        </div>
      </section>

      <div className="divider" />

      <section className="band band--cream">
        <div className="container">
          <div className="gearlist">
            {CAMERAS.map((cam) => (
              <article key={cam.name} className="gearrow">
                <span className="gearrow__emoji" aria-hidden="true">
                  {cam.img ? <img src={cam.img} alt="" /> : cam.emoji}
                </span>
                <div className="gearrow__info">
                  <h2 className="gearrow__name">{cam.name}</h2>
                  <p className="gearrow__tag">{cam.tag}</p>
                  <p className="gearrow__blurb">{cam.blurb}</p>
                </div>
                <div className="gearrow__side">
                  <span className="gearrow__price">₱{cam.price}<small>/day</small></span>
                  <button type="button" className="btn btn--primary gearrow__btn">
                    Rent this cam
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
