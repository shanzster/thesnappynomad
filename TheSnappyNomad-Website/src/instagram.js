import { useEffect, useState } from 'react'

// ── Instagram ────────────────────────────────────────────────────────────
// One token, shared by the Socials feed and the home-page strip.
export const IG_ACCESS_TOKEN = 'IGAAaNNuM1IHRBZAGI2VEN5aFMyUnNLU3EzVmtkLVd5QkZAaX0NsUlNNWFU1YjVjdEZAIN2dzRjlvR0cwNFJreHFYUjBJMjc3SjJMTy1sRG82U2tOd0V4ZA1loUHJIWUI0VE8tanJ0cUpnTjlMbFdBR3BLNG84aW5EeTktUlNJYUZATZAwZDZD'
export const IG_USERNAME = 'thesnappynomad'

let cachedPosts = null
let cachedProfile = null

// posts: null while loading, [] on error/empty, else the media list
export function useInstagramFeed(limit = 12) {
  const [posts, setPosts] = useState(cachedPosts)
  const [profile, setProfile] = useState(cachedProfile)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!IG_ACCESS_TOKEN || cachedPosts) return

    fetch(
      `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${IG_ACCESS_TOKEN}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          console.error('Instagram Profile Error:', d.error)
        } else {
          cachedProfile = d
          setProfile(d)
        }
      })
      .catch((err) => console.error('Profile Fetch Error:', err))

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
          cachedPosts = d.data || []
          setPosts(cachedPosts)
        }
      })
      .catch((err) => {
        console.error('Fetch Error:', err)
        setError(err.message)
        setPosts([])
      })
  }, [])

  return {
    posts: posts ? posts.slice(0, limit) : posts,
    profile,
    error,
  }
}
