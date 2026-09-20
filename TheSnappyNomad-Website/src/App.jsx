import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Nav, Footer, SnapEffect } from './shared.jsx'
import Home from './pages/Home.jsx'
import Gears from './pages/Gears.jsx'
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SnapEffect />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gears" element={<Gears />} />
        <Route path="/postcards" element={<Postcards />} />
        <Route path="/app" element={<TheApp />} />
        <Route path="/about" element={<About />} />
        <Route path="/socials" element={<Socials />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
