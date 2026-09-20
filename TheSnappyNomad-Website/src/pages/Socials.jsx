import { useEffect, useState } from 'react'
import { PHOTO_PLACEHOLDERS } from '../shared.jsx'

// ── Instagram ────────────────────────────────────────────────────────────
// Paste a long-lived Instagram access token here (Instagram Basic Display /
// Instagram Graph API) and the placeholder grid below is replaced by the
// real feed. See the on-page note for how to get one.
const IG_ACCESS_TOKEN = ''
const IG_USERNAME = 'thesnappynomad'

const SOCIALS = [
  { name: 'Instagram', handle: '@thesnappynomad', href: 'https://instagram.com/thesnappynomad', emoji: '📸' },
  { name: 'TikTok', handle: '@thesnappynomad', href: 'https://tiktok.com/@thesnappynomad', emoji: '🎬' },
  { name: 'Facebook', handle: 'The Snappy Nomad', href: 'https://facebook.com/thesnappynomad', emoji: '👥' },
  { name: 'YouTube', handle: 'The Snappy Nomad', href: 'https://youtube.com/@thesnappynomad', emoji: '📹' },
]

function InstagramFeed() {
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    if (!IG_ACCESS_TOKEN) return
    fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=12&access_token=${IG_ACCESS_TOKEN}`
    )
      .then((r) => r.json())
      .then((d) => setPosts(d.data || []))
      .catch(() => setPosts([]))
  }, [])

  if (IG_ACCESS_TOKEN && posts === null) {
    return <p className="igfeed__note">Loading the feed…</p>
  }

  if (posts && posts.length) {
    return (
      <div className="igfeed">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="igfeed__post"
            title={post.caption || ''}
          >
            <img
              src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
              alt={post.caption ? post.caption.slice(0, 80) : 'Instagram post'}
            />
          </a>
        ))}
      </div>
    )
  }

  // Placeholder grid until a token is added
  return (
    <>
      <div className="igfeed">
        {PHOTO_PLACEHOLDERS.map((p, i) => (
          <div key={i} className="igfeed__post igfeed__post--placeholder" style={{ background: p.bg }}>
            <span aria-hidden="true">{p.emoji}</span>
          </div>
        ))}
        {PHOTO_PLACEHOLDERS.slice(0, 4).map((p, i) => (
          <div key={`b${i}`} className="igfeed__post igfeed__post--placeholder" style={{ background: p.bg }}>
            <span aria-hidden="true">{p.emoji}</span>
          </div>
        ))}
      </div>
      <p className="igfeed__note">
        This grid goes live once an Instagram access token is added in{' '}
        <code>src/pages/Socials.jsx</code>.
      </p>
    </>
  )
}

export default function Socials() {
  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">Say hi</span>
          <h1 className="band__title">Our Socials</h1>
          <p className="band__blurb">
            Daily film scans, renter features, and the mascot doing mascot
            things. Come hang out.
          </p>
        </div>
      </header>

      <section className="band band--white">
        <div className="container">
          <div className="sociallinks">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="sociallink">
                <span className="sociallink__emoji" aria-hidden="true">{s.emoji}</span>
                <span className="sociallink__name">{s.name}</span>
                <span className="sociallink__handle">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="band band--cream">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow">@{IG_USERNAME}</span>
            <h2 className="band__title">Fresh off the feed</h2>
          </div>
          <InstagramFeed />
        </div>
      </section>
    </main>
  )
}
