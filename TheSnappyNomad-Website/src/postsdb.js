import { useEffect, useState } from 'react'

// ── Firebase (the app's database) ────────────────────────────────────────
// Web-app config — not secret (ships in every client bundle); access
// control lives in the Firestore security rules.
const FIREBASE_PROJECT_ID = 'thesnappynomaddd'
const FIREBASE_API_KEY = 'AIzaSyD8-rHrnF1anl63Q-nmJYWmxk297g0_SkI'
const POSTS_COLLECTION = 'posts'

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${POSTS_COLLECTION}?pageSize=60&key=${FIREBASE_API_KEY}`

// Unwrap a Firestore REST value ({stringValue: 'x'} → 'x', etc.)
function unwrap(v) {
  if (!v || typeof v !== 'object') return v
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('booleanValue' in v) return v.booleanValue
  if ('timestampValue' in v) return v.timestampValue
  if ('mapValue' in v) {
    const out = {}
    for (const [k, val] of Object.entries(v.mapValue.fields || {})) out[k] = unwrap(val)
    return out
  }
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(unwrap)
  return null
}

// App post schema: { authorName, caption, createdAt, location, uid,
//   photos: [{ url, mediaType, cameraName, cameraBrand, ... }],
//   likeCount, commentCount, likedBy }
function toPost(doc) {
  const fields = {}
  for (const [k, v] of Object.entries(doc.fields || {})) fields[k] = unwrap(v)

  const photos = Array.isArray(fields.photos) ? fields.photos : []
  const images = photos.filter((p) => p?.url && p.mediaType !== 'video')
  const rawDate = fields.createdAt || doc.createTime
  const date = rawDate ? new Date(rawDate) : null

  return {
    id: doc.name.split('/').pop(),
    image: images[0]?.url || null,
    images: images.map((p) => p.url),
    camera: images[0]?.cameraName || '',
    caption: typeof fields.caption === 'string' ? fields.caption : '',
    place: typeof fields.location === 'string' ? fields.location : '',
    author: typeof fields.authorName === 'string' ? fields.authorName : '',
    likes: Number(fields.likeCount) || 0,
    date: date && !isNaN(date) ? date : null,
  }
}

// posts: null while loading, [] on error/empty, else newest-first posts
export function useAppPosts() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(FIRESTORE_URL)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          console.error('Firestore error:', d.error)
          setError(d.error.message)
          setPosts([])
          return
        }
        const all = (d.documents || [])
          .map(toPost)
          .filter((p) => p.image) // a postcard needs a photo
          .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
          .slice(0, 6) // the wall shows the 6 most recent
        setPosts(all)
      })
      .catch((err) => {
        console.error('Firestore fetch failed:', err)
        setError(err.message)
        setPosts([])
      })
  }, [])

  return { posts, error }
}
