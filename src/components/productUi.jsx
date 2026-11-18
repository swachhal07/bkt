import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import TreadKicker from './TreadKicker'

/* Shared pieces for the Products index and the tyre detail page. Kicker and
   WipeLink follow the same spec as About and Leadership; ProductCard is the
   tyre tile used on both pages. Card motion lives in index.css under
   "Product cards". */

export const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const Kicker = ({ children, tone = 'light', align = 'center' }) => (
  <TreadKicker onDark={tone === 'dark'} align={align}>
    {children}
  </TreadKicker>
)

/* Translucent fill, green panel wipes in on hover. `href` for in-page jumps. */
export const WipeLink = ({ to, href, children, tone = 'light' }) => {
  const Tag = href ? 'a' : Link
  const target = href ? { href } : { to }
  const skin =
    tone === 'dark'
      ? 'border-white/15 bg-white/5 text-white'
      : 'border-ink/20 bg-ink/[0.02] text-ink hover:text-white'
  return (
    <Tag
      {...target}
      className={`group relative inline-flex items-center gap-3 overflow-hidden border px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${skin}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span className="relative">{children}</span>
      <Arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
    </Tag>
  )
}

/* Reveal-on-scroll, same as About/Leadership; re-runs when `key` changes so
   a new tyre page (same component, new slug) reveals its own sections. */
export function useReveal(key) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal:not(.is-visible)'))
    if (els.length === 0) return
    const revealAll = () => els.forEach((el) => el.classList.add('is-visible'))
    if (!('IntersectionObserver' in window)) {
      revealAll()
      return
    }
    let fired = false
    const io = new IntersectionObserver(
      (entries) => {
        fired = true
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const failsafe = setTimeout(() => {
      if (!fired) revealAll()
    }, 1600)
    return () => {
      io.disconnect()
      clearTimeout(failsafe)
    }
  }, [key])
}

/* Tyre tile. The cut-out render stands on a skewed brand-green slab (Home's
   stat-tile shape) that sits low like a plinth and rises behind the tyre on
   hover, while the tyre lifts and turns a few degrees. */
export function ProductCard({ product: p, index = 0, tile = 'bg-white' }) {
  return (
    <Link
      to={`/products/${p.slug}`}
      className="prod-card group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${tile}`}>
        <span
          aria-hidden="true"
          className="prod-slab absolute inset-x-[17%] bottom-0 h-[86%] rounded-[1.6rem_0.4rem_1.6rem_0.4rem] bg-brand"
        />
        <img
          src={p.image}
          alt={`${p.name} tyre`}
          loading="lazy"
          className="prod-tyre absolute inset-x-[12%] top-[9%] bottom-[7%] m-auto h-[84%] w-auto max-w-[76%] object-contain"
        />

        <span className="absolute left-5 top-5 font-mono text-[11px] tabular-nums tracking-[0.18em] text-ash">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="absolute right-4 top-4 flex gap-1.5">
          {p.isNew && (
            <span className="rounded-full bg-brand-glow px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
              New
            </span>
          )}
          <span className="rounded-full border border-ink/15 bg-white/80 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
            3D
          </span>
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 border-t border-ink/12 pt-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
            {p.sectorName} · {p.construction}
          </p>
          <h3 className="mt-1.5 font-wide text-xl font-bold uppercase leading-tight tracking-tight text-ink sm:text-2xl">
            {p.name}
          </h3>
          <p className="mt-1.5 text-sm text-ash">
            {p.machines.slice(0, 3).join(' · ')}
          </p>
        </div>
        <span className="mt-1 flex shrink-0 items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash">
            {p.sizeCount} {p.sizeCount === 1 ? 'size' : 'sizes'}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </span>
      </div>
    </Link>
  )
}
