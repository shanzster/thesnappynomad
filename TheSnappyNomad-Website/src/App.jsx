import { useEffect } from 'react'
import { BrowserRouter, Link, Routes, Route, useLocation } from 'react-router-dom'
import { Nav, Footer, SnapEffect, Mascot } from './shared.jsx'
import Chatbot from './chatbot/Chatbot.jsx'
import Home from './pages/Home.jsx'
import Gears from './pages/Gears.jsx'
import TestCams from './pages/TestCams.jsx'
import Postcards from './pages/Postcards.jsx'
import TheApp from './pages/TheApp.jsx'
import About from './pages/About.jsx'
import Socials from './pages/Socials.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <main className="page">
      <section className="band band--cream notfound">
        <div className="container notfound__inner">
          <Mascot className="notfound__mascot" />
          <span className="eyebrow">404 · lost in transit</span>
          <h1 className="band__title">This page wandered off</h1>
          <p className="band__blurb">
            The address on this postcard doesn't exist. Let's get you back on
            the route.
          </p>
          <Link to="/" className="btn btn--primary">Back home</Link>
        </div>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <a className="skiplink" href="#main">Skip to content</a>
      <ScrollToTop />
      <SnapEffect />
      <Nav />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gears" element={<Gears />} />
          <Route path="/test-cams" element={<TestCams />} />
          <Route path="/postcards" element={<Postcards />} />
          <Route path="/app" element={<TheApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  )
}

export default App
