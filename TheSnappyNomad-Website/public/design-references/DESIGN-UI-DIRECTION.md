# The Snappy Nomad — Design / UI Direction (Website)

Based on the brand moodboard (checkerboard key visual: groovy wordmark, retro
camera sticker, mascot tote). This document is the source of truth for anyone
building The Snappy Nomad website.

---

## 1. The vibe in one sentence

**A 1970s travel brand that sells film cameras out of a beach kiosk** — loud,
groovy, sticker-covered, and instantly huggable. Retro-pop, not retro-minimal.

Vibe words: *groovy · analog · playful · souvenir · sun-baked · collectible*
Anti-vibe words: *corporate · glassy · gradient-tech · minimalist · muted*

---

## 2. Color

The checkerboard IS the brand. Two dominant colors, hard against each other,
with cream as the resting surface.

| Token | Hex | Role |
|---|---|---|
| `--blue` | `#2B3FE0` | Checker blue, outlines, headline strokes, links |
| `--orange` | `#FF6B1A` | Checker orange, wordmark fill, primary buttons |
| `--cream` | `#F3EDDE` | Content panels, camera-body cream, "paper" |
| `--white` | `#FFFDF7` | Sticker fills, cards, product backgrounds |
| `--ink` | `#171A2B` | Body text, borders, offset shadows |
| `--red-pop` | `#E8401C` | Small accents only: badges, sale tags, mascot mouth |
| `--sky` | `#BFD3FF` | Rare cool relief (backgrounds behind product shots) |

Rules:
- **Checkerboard = orange × blue only.** Never other color pairs.
- Body copy never sits directly on the checkerboard — always on a cream/white
  panel or sticker shape placed over it.
- Yellow (`#FFD94A`, from the app) may appear in tiny doses (tape, stamps) but
  is NOT part of the website's core palette — the moodboard is orange/blue.

## 3. Typography

| Use | Font (Google Fonts) | Treatment |
|---|---|---|
| Display / wordmark-style headlines | **Shrikhand** | Orange fill + thick blue outline (`-webkit-text-stroke` or layered shadow), slight rotate (-2°), tight leading |
| Section headings | **Shrikhand** or **Bowlby One** | Solid blue or ink, no outline |
| Body / UI | **Karla** (700 for labels, 400 for copy) | Ink on cream/white |
| Eyebrows / stamps | Karla 800, ALL CAPS, letter-spacing 0.2em | Orange or blue |

Display type behaves like the logo: bouncy baseline is welcome (alternate
per-letter `translateY` on hero words), but never on body text.

## 4. Signature motifs (use these everywhere)

1. **Checkerboard** — hero backgrounds, section dividers (a 24px checker strip
   between sections), hover fills. Tile size ~28–40px on desktop. It can tilt
   slightly (2–3°) for energy.
2. **Die-cut sticker** — any image or card can be "stickered": white fat border
   (8–12px), irregular rounded silhouette, hard ink offset shadow, slight
   rotation (-3° to 3°). Product photos ALWAYS get the sticker treatment when
   placed on checkerboard.
3. **The mascot patch** — the little kiosk-awning face (scalloped orange/blue
   awning + two eyes). Use as: favicon, section bullet, loading indicator,
   footer sign-off, embroidered-patch corner on cards. Never stretch it; it's a
   patch, so it can sit slightly rotated like it was sewn on.
4. **Chunky offset shadows** — solid ink shadows (`4px 4px 0 var(--ink)`), no
   blur ever. Blur is the enemy of this brand.
5. **Souvenir ephemera** — luggage tags, postage stamps, ticket stubs, price
   tags as UI containers (price tag for rental prices, stamp for badges).

## 5. Layout system

- **Rhythm:** alternate loud and calm. Checkerboard hero → cream content band →
  checker divider strip → white product band → repeat. Never two loud bands
  touching.
- Panels on checkerboard float like posters taped to a wall: rounded 16–24px,
  2px ink border, offset shadow, tiny rotation.
- Max content width ~1120px; generous padding (the moodboard breathes).
- Product/gear photos: on white sticker shapes, big, centered, slightly
  overlapping section boundaries (like the camera bleeding over the checker).

## 6. Components

| Component | Spec |
|---|---|
| **Primary button** | Pill, orange fill, 2px ink border, `4px 4px 0` ink shadow, Karla 800. Hover: translate(2px,2px), shadow shrinks to 2px (pressed-sticker feel). |
| **Secondary button** | Same geometry, white fill, blue text. |
| **Card** | White or cream, 2px ink border, offset shadow, optional mascot patch in a corner, optional checker header strip. |
| **Nav** | Cream bar, wordmark left (Shrikhand orange w/ blue outline), pill links; active link = blue pill. Sticky with 2px ink bottom border. |
| **Section divider** | Full-width 20–28px checkerboard strip, optionally at 2° tilt. |
| **Price tag** | Rotated tag shape with punched hole + string illustration, orange, for ₱/day prices. |
| **Marquee** | Ink strip, orange Shrikhand text scrolling: "SNAP ✦ POSE ✦ WANDER ✦". |
| **Footer** | Solid blue, cream text, checker top border, mascot patch waving goodbye. |

## 7. Imagery

- Product photography style: warm, slightly overexposed, on white — then
  die-cut into stickers (like the moodboard camera + tote).
- Travel photos: treat as polaroids/postcards (white frame, caption strip),
  matching the app's feed.
- Illustration: flat, thick-outlined, limited to palette colors. The mascot is
  the only recurring character.
- No stock-photo gradients, no dark moody photography.

## 8. Motion

- Sticker peel: cards/buttons lift and rotate ~1.5° on hover.
- Marquee strips scroll slowly and infinitely.
- Hero letters can bounce in one-by-one on load (staggered 40ms).
- Checkerboard may scroll-shift very subtly (parallax ≤ 10px). Nothing floaty,
  nothing blurred, no fade-only transitions — movement should feel *snappy*
  (200ms, ease-out).

## 9. Accessibility guardrails

- Body text: ink on cream/white only (≥ 7:1). Never orange-on-blue for text
  under 24px.
- Outlined display text needs ≥ 3px stroke to stay legible on checker.
- Checkerboard sections must pass a "squint test": content panels opaque, no
  text bleeding into the pattern.
- Respect `prefers-reduced-motion`: kill marquee + bounce, keep layout.

## 10. CSS starter tokens

```css
:root {
  --blue: #2B3FE0;
  --orange: #FF6B1A;
  --cream: #F3EDDE;
  --white: #FFFDF7;
  --ink: #171A2B;
  --red-pop: #E8401C;

  --border: 2px solid var(--ink);
  --shadow: 4px 4px 0 var(--ink);
  --radius: 18px;

  --font-display: 'Shrikhand', cursive;
  --font-body: 'Karla', sans-serif;

  --checker: repeating-conic-gradient(
    var(--orange) 0% 25%, var(--blue) 0% 50%
  ) 0 0 / 64px 64px; /* background: var(--checker) */
}
```

## 11. Relationship to the app

The app stays claymorphic (soft clay cards, royal blue `#2B4EFF`, cream canvas)
— the website is the *louder sibling*: same family (blue/orange/cream, polaroid
imagery, playful copy) but turned up with checkerboard + Shrikhand + stickers.
Shared across both: the mascot, the polaroid photo treatment, "Snap · Pose ·
Wander", and the voice — short, warm, a little cheeky.

*Drafted 2026-09-15 from the brand moodboard. Living document.*
