import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import logo from '../assets/pngfind.com-tire-marks-png-139014.png'
import logoSolid from '../assets/logo-solid.png'
import dugarLogo from '../assets/dugar-logo.png'

const productMenu = [
  { to: '/products', label: 'Passenger & Highway' },
  { to: '/products', label: 'SUV & Performance' },
  { to: '/products', label: 'Truck & Fleet' },
  { to: '/products', label: 'View all products' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tucked, setTucked] = useState(false)
  const lastY = useRef(0)
  const { pathname } = useLocation()

  const isHome = pathname === '/'

  /* Scroll direction: the bar tucks away going down and returns coming up.
     DELTA gives the gesture slack so trackpad jitter — or the browser's own
     scroll-anchoring nudge when an image finishes loading — can't flicker it. */
  useEffect(() => {
    const HIDE_BELOW = 140 // never tuck over the top of the page
    const DELTA = 8 // ignore movement smaller than this

    const evaluate = () => {
      const y = Math.max(0, window.scrollY)
      setScrolled(y > 16)

      const moved = y - lastY.current
      if (Math.abs(moved) > DELTA) {
        setTucked(y > HIDE_BELOW && moved > 0)
        lastY.current = y
      } else if (y <= HIDE_BELOW) {
        setTucked(false)
        lastY.current = y
      }
    }

    /* Reads two numbers and sets two booleans — cheap enough to run on the
       event itself. No rAF throttle: it would only defer the work by a frame
       and stalls outright in webviews that throttle animation callbacks. */
    lastY.current = Math.max(0, window.scrollY)
    evaluate()
    window.addEventListener('scroll', evaluate, { passive: true })
    return () => window.removeEventListener('scroll', evaluate)
  }, [])

  /* Route change lands at the top of a new page — never behind a hidden bar. */
  useEffect(() => {
    setTucked(false)
    lastY.current = 0
  }, [pathname])

  /* Hold the bar in place whenever it's being used: pointer over it, mobile
     menu open, or keyboard focus somewhere inside it. */
  const hidden = tucked && !hovered && !open

  // Transparent only at the top of the dark home hero — becomes solid
  // on scroll, when the mobile menu is open, or on hover.
  const transparent = isHome && !scrolled && !open && !hovered

  const linkBase = 'text-lg font-medium transition-colors'
  const linkClass = ({ isActive }) =>
    `${linkBase} ${
      transparent
        ? 'text-white hover:text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]'
        : isActive
          ? 'text-brand'
          : 'text-ink hover:text-brand'
    }`

  const caret = (
    <svg className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      /* React's onFocus bubbles, so tabbing into any link brings the bar back. */
      onFocus={() => setTucked(false)}
      /* Slide/fade timing lives in `.nav-bar` in index.css — tune it with
         --nav-tuck-duration there, not with utilities here. */
      className={`nav-bar fixed inset-x-0 top-0 z-40 ${hidden ? 'nav-bar--hidden' : ''} ${
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-gray-200 bg-white/90 backdrop-blur'
      } ${
        /* Shadow whenever the bar is solid, so it always sits above the page
           rather than butting flat against it — deeper once scrolled, since the
           bar is then genuinely floating over content. Fades in `.nav-bar`. */
        transparent || hidden
          ? 'shadow-none'
          : scrolled
            ? 'shadow-[0_14px_34px_-16px_rgba(22,24,28,0.4)]'
            : 'shadow-[0_8px_24px_-18px_rgba(22,24,28,0.32)]'
      }`}
    >
      {/* Brand-green hairline wipes across the foot of the bar as it docks back
          in — the same left-origin wipe the buttons use. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand transition-transform duration-700 ease-out motion-reduce:hidden ${
          scrolled && !hidden ? 'scale-x-100 delay-100' : 'scale-x-0'
        }`}
      />
      <nav className="relative flex items-center px-4 py-5 sm:px-6 lg:px-24 lg:pr-10">
        {/* Logo (left) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={dugarLogo}
            alt="MV Dugar Group"
            className={`h-12 w-auto transition-[filter] duration-300 sm:h-14 ${
              transparent ? '[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]' : ''
            }`}
          />
          <span
            className={`h-8 w-px transition-colors duration-300 ${
              transparent ? 'bg-white/40' : 'bg-gray-300'
            }`}
            aria-hidden="true"
          />
          <Link to="/" className="flex items-center" aria-label="BKT Tyres — home">
            <img
              src={transparent ? logo : logoSolid}
              alt="BKT Tyres"
              className={`h-11 w-auto transition-[filter] duration-300 sm:h-12 ${
                transparent ? '[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]' : ''
              }`}
            />
          </Link>
        </div>

        {/* Links (right, next to Contact) */}
        <div className="hidden items-center gap-10 md:ml-auto md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>

          {/* Products dropdown */}
          <div className="group relative">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${linkClass({ isActive })} flex items-center gap-1`
              }
            >
              Products {caret}
            </NavLink>
            <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl shadow-black/5">
                {productMenu.map((p) => (
                  <Link
                    key={p.label}
                    to={p.to}
                    className="block px-4 py-2.5 text-sm text-ash transition-colors hover:bg-fog hover:text-brand"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <NavLink to="/about" className={linkClass}>About</NavLink>

          <NavLink to="/blog" className={linkClass}>Blog</NavLink>

          <NavLink to="/contact" className={linkClass}>Contact Us</NavLink>
        </div>

        {/* Mobile toggle */}
        <div className="ml-auto flex items-center md:hidden">
          <button
            type="button"
            className={`md:hidden ${transparent ? 'text-white' : 'text-ink'}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col px-4 py-2">
            <NavLink to="/" end onClick={() => setOpen(false)} className="text-base font-medium text-ink hover:text-brand">
              <span className="block py-3">Home</span>
            </NavLink>

            <button
              type="button"
              className="flex items-center justify-between py-3 text-base font-medium text-ink"
              aria-expanded={productsOpen}
              onClick={() => setProductsOpen((v) => !v)}
            >
              Products
              <svg className={`h-4 w-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {productsOpen && (
              <div className="mb-1 flex flex-col border-l border-gray-200 pl-4">
                {productMenu.map((p) => (
                  <Link
                    key={p.label}
                    to={p.to}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm text-ash hover:text-brand"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}

            <NavLink to="/about" onClick={() => setOpen(false)} className="text-base font-medium text-ink hover:text-brand">
              <span className="block py-3">About</span>
            </NavLink>

            <NavLink to="/blog" onClick={() => setOpen(false)} className="text-base font-medium text-ink hover:text-brand">
              <span className="block py-3">Blog</span>
            </NavLink>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 mb-2 rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
