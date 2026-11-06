import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Leadership from './pages/Leadership'
import HeroLab from './pages/HeroLab'
import GroupLab from './pages/GroupLab'
import NotFound from './pages/NotFound'

/* A route change is a new page, so it starts at the top. React Router keeps
   the window's scroll position by default, which meant following a link from
   halfway down one page dropped you halfway down the next.
   Three cases are deliberately left alone:
     · POP (browser back/forward) — the browser restores that position itself,
       and overriding it would lose the reader's place;
     · a hash in the URL — the target anchor owns the scroll;
     · 'instant' rather than the document's smooth scrolling, since this is an
       arrival, not a movement within a page. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP' || hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, navigationType])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <ScrollToTop />
      <Navbar />
      {/* Home hero sits under the transparent nav; other pages clear the fixed bar */}
      <main className={`flex-1 ${isHome ? '' : 'pt-24'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/about-heroes" element={<HeroLab />} />
          <Route path="/group-lab" element={<GroupLab />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
