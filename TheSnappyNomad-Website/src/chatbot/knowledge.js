// Snappy's brain — a keyword-scored knowledge base built from the site's
// own content. No API, no server, no cost. Add an intent (or keywords to
// an existing one) and the bot knows it everywhere the site is hosted.

import { CAMERAS } from '../shared.jsx'

const gearList = CAMERAS.map((c) => `• ${c.name} (${c.tag}) — ₱${c.price}/day`).join('\n')
const cheapest = CAMERAS.reduce((a, b) => (a.price < b.price ? a : b))
const priciest = CAMERAS.reduce((a, b) => (a.price > b.price ? a : b))

export const GREETING = {
  text: "Kumusta, Nomad! 👋 I'm Snappy, the kiosk mascot. Ask me about our cameras, prices, the app, postcards — or anything Snappy Nomad.",
  chips: ['What cameras do you have?', 'How much is a rental?', 'Tell me about the app', 'Who are you guys?'],
}

export const FALLBACK = {
  text: "Hmm, that one's outside my viewfinder 📷 — I'm just a little kiosk mascot. Try asking about our cameras, prices, the app, or our story. For anything else, message us on Facebook or Instagram @thesnappynomad and a human will snap back!",
  chips: ['What cameras do you have?', 'Where can I follow you?'],
}

// Each intent: keywords (scored per hit; longer phrases score more via
// word count), the reply text, and optional follow-up chips.
export const INTENTS = [
  {
    keywords: ['hello', 'hi', 'hey', 'kumusta', 'kamusta', 'yo', 'good morning', 'good afternoon', 'good evening', 'sup'],
    text: "Kumusta! 👋 Ready to snap, pose, and wander? Ask me anything about The Snappy Nomad.",
    chips: ['What cameras do you have?', 'How does renting work?'],
  },
  {
    keywords: ['camera', 'cameras', 'gear', 'gears', 'kit', 'equipment', 'what do you rent', 'cams', 'cam'],
    text: `Here's the full shelf — every camera we rent:\n${gearList}\n\nMulti-day trips get the nomad discount! 🎒`,
    chips: ['Which is cheapest?', 'Which camera for the beach?', 'How does renting work?'],
  },
  {
    keywords: ['price', 'prices', 'cost', 'how much', 'rate', 'rates', 'magkano', 'fee', 'daily', 'per day', 'rental price'],
    text: `Rentals run from ₱${cheapest.price}/day (${cheapest.name}) up to ₱${priciest.price}/day (${priciest.name}).\n${gearList}\n\nRenting for a multi-day trip? You get the nomad discount. ✈️`,
    chips: ['What cameras do you have?', 'What is the nomad discount?'],
  },
  {
    keywords: ['cheapest', 'cheap', 'budget', 'affordable', 'lowest'],
    text: `The most budget-friendly cam is the ${cheapest.name} at ₱${cheapest.price}/day — ${cheapest.blurb.toLowerCase()}`,
    chips: ['Show me all cameras', 'How does renting work?'],
  },
  {
    keywords: ['discount', 'promo', 'deal', 'nomad discount', 'multi-day', 'week', 'long trip'],
    text: "Multi-day trips get the nomad discount — the longer you wander, the less you pay per day. Message us on Facebook or Instagram with your dates and we'll quote you. 🧳",
    chips: ['Where can I follow you?', 'What cameras do you have?'],
  },
  {
    keywords: ['instax', 'instant', 'polaroid', 'print'],
    text: "The Instax Mini 11 (₱349/day) — point, shoot, shake the print. Souvenirs on the spot. 📸",
    chips: ['Show me all cameras'],
  },
  {
    keywords: ['film', 'charmera', 'kodak', 'analog', 'grain', 'grainy', '35mm'],
    text: "For film lovers we have the Kodak Charmera (₱299/day) — tiny, grainy, gorgeous, and the most collectible thing we own. 🎞️ Film rentals come back as high-res scans straight into the app, polaroid-framed and ready to share.",
    chips: ['Tell me about the app', 'Show me all cameras'],
  },
  {
    keywords: ['gopro', 'action', 'surf', 'dive', 'underwater', 'waterproof', 'beach', 'swim', 'snorkel', 'island hopping'],
    text: "For beach and action days: the GoPro Hero 13 (₱599/day) — strap it, dunk it, drop it, it films through everything 🏄 — or the Insta360 (₱649/day) for shoot-everything, frame-it-later third-person magic.",
    chips: ['Show me all cameras', 'How much is a rental?'],
  },
  {
    keywords: ['insta360', '360'],
    text: "The Insta360 (₱649/day) shoots everything around you — frame it later. Third-person magic. 🌀",
    chips: ['Show me all cameras'],
  },
  {
    keywords: ['dslr', 'mirrorless', 'canon', 'rebel', 'm10', 'professional', 'quality', 'crispy', 'selfie', 'vlog'],
    text: "For serious shots: the Canon EOS M10 mirrorless (₱549/day) does flip-screen selfies and crispy street shots, and the Canon EOS Rebel T6 DSLR (₱499/day) is the trusty workhorse for golden-hour everything. 🌄",
    chips: ['Show me all cameras'],
  },
  {
    keywords: ['digicam', 'olympus', 'y2k', 'vintage', 'retro', 'aesthetic', 'vibes'],
    text: "Digicam-core forever ✨ — the Olympus FE-4000 (₱329/day). Flash on, vibes immaculate.",
    chips: ['Show me all cameras'],
  },
  {
    keywords: ['rent', 'renting', 'book', 'booking', 'reserve', 'how does it work', 'process', 'pickup', 'return', 'avail'],
    text: "Renting is easy: pick a cam, pick your dates, pay — three taps in the app, where your rental lives on one screen with pickup details and countdowns. 🗓️ No app yet? Message us on Facebook or Instagram and we'll sort you out.",
    chips: ['Tell me about the app', 'What cameras do you have?', 'Where can I follow you?'],
  },
  {
    keywords: ['app', 'application', 'download', 'app store', 'google play', 'ios', 'android', 'phone'],
    text: "The Snappy Nomad app puts your trip in your pocket: book in three taps, get film scans delivered straight to your phone, pin every shot on the Snap Map, and collect passport stamps for each destination. 🏅 It's coming soon to the App Store and Google Play — check the App page for a peek!",
    chips: ['What is the Snap Map?', 'What are passport stamps?'],
  },
  {
    keywords: ['snap map', 'map', 'pinned', 'location'],
    text: "The Snap Map pins every shot to where you took it — your trip becomes a map of little polaroids. 📍",
    chips: ['Tell me about the app'],
  },
  {
    keywords: ['stamp', 'stamps', 'passport', 'badge', 'collection', 'batanes stamp'],
    text: "You earn passport stamps in the app for every destination you shoot. Batanes stamp holders get bragging rights forever. 🏅",
    chips: ['Tell me about the app'],
  },
  {
    keywords: ['scan', 'scans', 'photos back', 'get my photos', 'develop', 'delivered'],
    text: "Film rentals come back as high-res scans straight into the app — polaroid-framed and ready to share. 🎞️",
    chips: ['Tell me about the app', 'Show me all cameras'],
  },
  {
    keywords: ['postcard', 'postcards', 'mail', 'carte postale'],
    text: "Postcards are our love letter to the old-school souvenir — check the Postcards page to flip through cards from renters all over the Philippines. Wish you were here! ✈️",
  },
  {
    keywords: ['about', 'story', 'who are you', 'company', 'brand', 'history', 'started', 'kiosk', 'mascot', 'who is snappy'],
    text: "We're a travel camera rental brand from the Philippines 🇵🇭 — we believe the best souvenir is a bad photo of a great day. It started in 2024 with one borrowed digicam that came back from Siargao full of the best photos we'd ever seen (and a little sand). 2025 was the kiosk era — a folding table, five cameras, a laminated price list. Now it's a full shelf of gear plus the app. I'm the mascot — drawn on the back of a boarding pass somewhere over Cebu, and still on every camera we send out. ✈️",
    chips: ['What cameras do you have?', 'Where can I follow you?'],
  },
  {
    keywords: ['social', 'socials', 'instagram', 'facebook', 'follow', 'ig', 'contact', 'message', 'reach', 'email', 'dm'],
    text: "Come hang out! 📱 We're @thesnappynomad on Instagram (daily film scans, renter features, mascot doing mascot things) and The Snappy Nomad on Facebook — facebook.com/thesnappynomad. DMs are the fastest way to reach a human.",
    chips: ['How does renting work?'],
  },
  {
    keywords: ['where', 'location', 'based', 'philippines', 'manila', 'cebu', 'siargao', 'palawan', 'el nido', 'destination', 'destinations', 'travel', 'boracay', 'bohol', 'coron', 'vigan', 'sagada', 'batanes', 'davao'],
    text: "We're from the Philippines 🇵🇭 and our cameras have wandered everywhere — Manila, El Nido, Siargao, Cebu, Bohol, Vigan, Sagada, Batanes, Coron, Davao and beyond. Wherever you're headed, there's a cam for it.",
    chips: ['Which camera for the beach?', 'What cameras do you have?'],
  },
  {
    keywords: ['thanks', 'thank you', 'salamat', 'ty', 'appreciate'],
    text: "Walang anuman! 🧡 Happy wandering — and remember: snap, pose, wander. See you out there!",
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'paalam'],
    text: "Paalam, Nomad! ✈️ Bring me somewhere nice. 📷",
  },
]

/* ============ Gemini fallback ============ */
// Only fires when no scripted intent matches. The system prompt keeps it
// strictly on Snappy Nomad topics so random questions don't spend quota
// on answers people could just google.

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

const SYSTEM_PROMPT = `You are Snappy, the friendly kiosk mascot chatbot of The Snappy Nomad — a travel camera rental brand from the Philippines ("Snap · Pose · Wander"). You live on their website.

Brand facts you may use:
- Cameras for rent (per day): ${CAMERAS.map((c) => `${c.name} (${c.tag}) ₱${c.price}`).join('; ')}.
- Multi-day rentals get the "nomad discount" — customers should DM for a quote.
- The Snappy Nomad app (coming soon to App Store & Google Play): book in three taps, film scans delivered in-app, Snap Map pins shots to locations, passport stamps per destination.
- Story: started 2024 with one borrowed digicam that came back from Siargao full of great photos; 2025 was the kiosk era; now a full gear shelf plus the app.
- Socials: Instagram @thesnappynomad, facebook.com/thesnappynomad. DMs are the fastest way to reach a human.

STRICT SCOPE RULES:
- ONLY answer questions that relate to The Snappy Nomad: its cameras and rentals, photography/camera tips for renters, or traveling in the Philippines WITH our cameras (e.g. "which of your cams should I bring to El Nido?", "tips for shooting film in Siargao?").
- If the question is generic travel planning, general knowledge, or anything unrelated to The Snappy Nomad (e.g. "where should I vacation?", "book me a flight", homework, coding), politely decline in ONE short sentence and suggest they search online or DM @thesnappynomad — do NOT answer the question itself.
- Never invent prices, policies, locations, or services beyond the facts above. If you don't know a business detail, say so and point to the socials.
- Keep replies short (1-3 sentences), warm and playful, with the occasional emoji. A little Filipino flavor (kumusta, salamat) is welcome.`

export async function askGemini(question, history = []) {
  if (!GEMINI_KEY) return null
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            ...history.slice(-6).map((m) => ({
              role: m.from === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }],
            })),
            { role: 'user', parts: [{ text: question }] },
          ],
          // The model spends part of this budget on internal thinking,
          // so keep it roomy or short replies come back empty.
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim()
    return text || null
  } catch {
    return null
  }
}

// Score every intent against the message; longest keyword hits win.
export function findReply(message) {
  const msg = ` ${message.toLowerCase().replace(/[^a-z0-9₱ ]/g, ' ').replace(/\s+/g, ' ').trim()} `
  let best = null
  let bestScore = 0
  for (const intent of INTENTS) {
    let score = 0
    for (const kw of intent.keywords) {
      if (msg.includes(` ${kw} `) || (kw.includes(' ') && msg.includes(kw))) {
        score += kw.split(' ').length * (kw.length > 4 ? 2 : 1)
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }
  // null = no scripted match; the widget then tries the Gemini fallback
  return best
}
