import { useAppPosts } from '../postsdb.js'

const TILTS = ['-2deg', '1.5deg', '-1deg', '2deg', '-2.5deg', '1deg']

function formatDate(date) {
  return date
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    .toUpperCase()
}

// A photo postcard straight from the app: shot on top, caption in
// handwriting below, signed by the author, postmarked with place + date.
function PhotoPostcard({ post, rot }) {
  return (
    <article className="ppost" style={{ '--rot': rot }}>
      <div className="ppost__photo">
        <img src={post.image} alt={post.caption || 'Travel postcard'} loading="lazy" />
        {post.camera && <span className="ppost__camera">📷 {post.camera}</span>}
      </div>
      {post.caption && (
        <p className="ppost__caption">
          {post.caption}
          {post.author && <span className="ppost__sign">— {post.author}</span>}
        </p>
      )}
      <span className="ppost__postmark">
        <span>
          {[post.place, post.date && formatDate(post.date)].filter(Boolean).join(' · ')}
        </span>
        {post.likes > 0 && <span>♥ {post.likes}</span>}
      </span>
    </article>
  )
}

export default function Postcards() {
  const { posts } = useAppPosts()

  return (
    <main className="page">
      <header className="page__head band band--cream">
        <div className="container">
          <span className="eyebrow">Mail from everywhere</span>
          <h1 className="band__title">Postcards from people</h1>
          <p className="band__blurb">
            Every shot posted in The Snappy Nomad app lands here — straight
            from the road, stamps and all.
          </p>
        </div>
      </header>

      <section className="band band--white">
        <div className="container">
          {posts === null && (
            <p className="mailwall__note">checking the mailbox… ✉️</p>
          )}
          {posts && posts.length === 0 && (
            <p className="mailwall__note">
              The mailbox is empty right now — post a shot in the app and it
              shows up here. 📮
            </p>
          )}
          {posts && posts.length > 0 && (
            <div className="mailwall">
              {posts.map((post, i) => (
                <PhotoPostcard key={post.id} post={post} rot={TILTS[i % TILTS.length]} />
              ))}
            </div>
          )}
          <p className="band__more">
            Rented with us? Post your shots in the app — or mail a real paper
            postcard; those get pinned in the shop. 📮
          </p>
        </div>
      </section>
    </main>
  )
}
