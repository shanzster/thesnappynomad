import { useState } from 'react'
import { CAMERAS } from '../shared.jsx'
import { CamSheet } from '../camsheet.jsx'

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
                  {cam.img ? <img src={cam.img} alt="" loading="lazy" /> : <span aria-hidden="true">{cam.emoji}</span>}
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
