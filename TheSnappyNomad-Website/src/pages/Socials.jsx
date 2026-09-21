import { useEffect, useState } from 'react'
import { PHOTO_PLACEHOLDERS } from '../shared.jsx'

// ── Instagram ────────────────────────────────────────────────────────────
const IG_ACCESS_TOKEN = 'IGAAaNNuM1IHRBZAGI2VEN5aFMyUnNLU3EzVmtkLVd5QkZAaX0NsUlNNWFU1YjVjdEZAIN2dzRjlvR0cwNFJreHFYUjBJMjc3SjJMTy1sRG82U2tOd0V4ZA1loUHJIWUI0VE8tanJ0cUpnTjlMbFdBR3BLNG84aW5EeTktUlNJYUZATZAwZDZD'
const IG_USERNAME = 'thesnappynomad'

const SOCIALS = [
  { name: 'Facebook', handle: 'The Snappy Nomad', href: 'https://facebook.com/thesnappynomad', emoji: '👥' },
]

function InstagramFeed() {
  const [posts, setPosts] = useState(null)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!IG_ACCESS_TOKEN) return
    
    // Fetch profile info
    fetch(
      `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${IG_ACCESS_TOKEN}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          console.error('Instagram Profile Error:', d.error)
        } else {
          setProfile(d)
        }
      })
      .catch((err) => {
        console.error('Profile Fetch Error:', err)
      })

    // Fetch posts
    fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${IG_ACCESS_TOKEN}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          console.error('Instagram API Error:', d.error)
          setError(d.error.message)
          setPosts([])
        } else {
          setPosts(d.data || [])
        }
      })
      .catch((err) => {
        console.error('Fetch Error:', err)
        setError(err.message)
        setPosts([])
      })
  }, [])

  if (error) {
    return <p className="igfeed__note">Could not load Instagram feed: {error}</p>
  }

  if (IG_ACCESS_TOKEN && posts === null) {
    return <p className="igfeed__note">Loading the feed…</p>
  }

  if (posts && posts.length) {
    return (
      <div className="igfeed-framed">
        {posts.map((post) => (
          <article key={post.id} className="igpost">
            <div className="igpost__header">
              {profile?.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url} 
                  alt={profile.username}
                  className="igpost__avatar-img"
                />
              ) : (
                <div className="igpost__avatar">📸</div>
              )}
              <div className="igpost__info">
                <span className="igpost__username">@{profile?.username || IG_USERNAME}</span>
              </div>
            </div>
            <a
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="igpost__image-link"
            >
              <img
                src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                alt={post.caption ? post.caption.slice(0, 80) : 'Instagram post'}
                className="igpost__image"
              />
            </a>
            {post.caption && (
              <div className="igpost__caption">
                <span className="igpost__username">@{profile?.username || IG_USERNAME}</span>{' '}
                <span className="igpost__caption-text">
                  {post.caption.length > 120 ? post.caption.slice(0, 120) + '...' : post.caption}
                </span>
              </div>
            )}
            <a
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="igpost__link"
            >
              View on Instagram →
            </a>
          </article>
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
          <div className="band__head">
            <span className="eyebrow">@{IG_USERNAME}</span>
            <h2 className="band__title">Fresh off the feed</h2>
          </div>
          <InstagramFeed />
        </div>
      </section>

      <div className="divider" />

      <section className="band band--cream">
        <div className="container">
          <div className="band__head">
            <span className="eyebrow">Connect with us</span>
            <h2 className="band__title">Other Socials</h2>
          </div>
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
    </main>
  )
}
