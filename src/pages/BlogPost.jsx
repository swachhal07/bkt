import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getNeighbours, getPost } from '../data/posts'
import NotFound from './NotFound'

/* Hallmark · genre: editorial · macrostructure: Article
 * scope: BlogPost.jsx (/blog/:slug) · tone: printed journal, photography first
 * theme: BKT brand tokens (preserved — client palette, no catalog swap)
 * archetypes: dark photo masthead · single 64ch measure with drop cap,
 *             subheads and a pull quote · dotted-leader colophon · next plates
 * enrichment: none invented — client photography only, ungraded
 * motion: reveal fade-up + anim-rise entrance (no third primitive)
 * nav/footer: n/a — owned by Navbar.jsx / Footer.jsx
 */

const Icon = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  back: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  ),
}

/* One measure, three block types. Anything unrecognised is skipped rather than
   rendered raw, so a typo in the data file can't put `[object Object]` on screen. */
const Block = ({ block, first }) => {
  if (block.type === 'h') {
    return (
      <h2 className="font-wide mt-14 text-[clamp(1.35rem,2.2vw,1.9rem)] font-extrabold uppercase leading-tight tracking-tight text-ink">
        {block.text}
      </h2>
    )
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="my-14 border-l-[3px] border-brand pl-6 sm:pl-8">
        <p className="font-display text-[clamp(1.5rem,3vw,2.35rem)] font-bold uppercase leading-[1.06] tracking-tight text-ink">
          {block.text}
        </p>
      </blockquote>
    )
  }

  if (block.type !== 'p') return null

  return (
    <p
      className={`font-sans text-[17px] leading-[1.72] text-ash sm:text-[18px] ${first ? '' : 'mt-6'} ${
        first
          ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[3.4rem] first-letter:font-bold first-letter:uppercase first-letter:leading-[0.72] first-letter:text-brand'
          : ''
      }`}
    >
      {block.text}
    </p>
  )
}

/* Dotted-leader row — the same printed-sheet device as the Contact spec block. */
const ColophonRow = ({ label, value }) => (
  <div className="flex items-baseline gap-3 py-3">
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash">{label}</span>
    <span className="min-w-6 flex-1 translate-y-[-0.3rem] border-b border-dotted border-ink/25" />
    <span className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink">
      {value}
    </span>
  </div>
)

/* Onward plate for prev / next. */
const NextStory = ({ post, kicker }) => (
  <Link to={`/blog/${post.slug}`} className="group block">
    <div className="relative h-44 overflow-hidden bg-carbon sm:h-56">
      <img
        src={post.img}
        alt={post.alt}
        className="h-full w-full object-cover opacity-90 transition-all duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:opacity-100"
        loading="lazy"
      />
      <span className="pointer-events-none absolute left-0 top-0 bg-brand px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white">
        {kicker}
      </span>
    </div>
    <h3 className="font-display mt-4 text-[clamp(1.3rem,1.9vw,1.75rem)] font-bold uppercase leading-[1.05] tracking-tight text-ink transition-colors group-hover:text-brand">
      {post.title}
    </h3>
    <span className="mt-3 inline-flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ash transition-colors group-hover:text-brand">
      {post.category} · {post.read}
      <Icon.arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
    </span>
  </Link>
)

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  const { prev, next } = getNeighbours(slug)

  /* A fresh article starts at the top, not wherever the index was scrolled to,
     and the reveal observer is re-armed for the new DOM. Keyed on `slug` so
     navigating between articles re-runs both. */
  useEffect(() => {
    window.scrollTo(0, 0)

    const els = Array.from(document.querySelectorAll('.reveal:not(.is-visible)'))
    if (els.length === 0) return

    const revealAll = () => els.forEach((el) => el.classList.add('is-visible'))

    if (!('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    let ioFired = false
    const io = new IntersectionObserver(
      (entries) => {
        ioFired = true
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))

    const failsafe = setTimeout(() => {
      if (!ioFired) revealAll()
    }, 1600)

    return () => {
      io.disconnect()
      clearTimeout(failsafe)
    }
  }, [slug])

  /* An unknown slug is a genuine 404, not an empty article shell. */
  if (!post) return <NotFound />

  const firstParaIndex = post.body.findIndex((b) => b.type === 'p')

  return (
    <>
      {/* ══ ARTICLE MASTHEAD ══════════════════════════════════════════ */}
      {/* Photography carries the opening; type sits on carbon over it so it
          stays legible whatever the underlying photo does. */}
      <header className="relative overflow-hidden bg-carbon">
        <img
          src={post.img}
          alt={post.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/40"
        />

        <div className="relative mx-auto max-w-[100rem] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-10">
          <Link
            to="/blog"
            className="group anim-rise inline-flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-brand-glow"
          >
            <Icon.back className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            The Journal
          </Link>

          <div className="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="anim-rise flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px]" style={{ animationDelay: '60ms' }}>
                <span className="text-brand-glow">{post.category}</span>
                <span className="h-1 w-1 bg-white/30" aria-hidden="true" />
                <span className="text-white/60">{post.date}</span>
                <span className="h-1 w-1 bg-white/30" aria-hidden="true" />
                <span className="text-white/60">{post.read} read</span>
              </div>

              {/* Fluid display type sized against the column. */}
              <h1
                className="font-wide anim-rise mt-6 text-[clamp(2.1rem,5.4vw,4.75rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-white"
                style={{ animationDelay: '120ms' }}
              >
                {post.title}
              </h1>
            </div>

            <p
              className="anim-rise font-sans text-base leading-relaxed text-white/65 lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-8 sm:text-lg"
              style={{ animationDelay: '220ms' }}
            >
              {post.excerpt}
            </p>
          </div>
        </div>
      </header>

      {/* ══ ARTICLE BODY ══════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[100rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
            {/* One measure, held at 64ch — the whole article is a single column. */}
            <div className="reveal lg:col-span-7 xl:col-span-7">
              <div className="max-w-[64ch] border-t-2 border-ink pt-8">
                {post.body.map((block, i) => (
                  <Block key={i} block={block} first={i === firstParaIndex} />
                ))}
              </div>

              <div className="mt-14 max-w-[64ch] border-t border-ink/12 pt-6">
                <p className="font-sans text-sm leading-relaxed text-ash">
                  Questions about anything above, or a fitment you want checked
                  against your own machine?{' '}
                  <Link
                    to="/contact"
                    className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand"
                  >
                    Write to the desk
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Colophon rail — sticky so it stays with the reader down the column. */}
            <aside className="reveal lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-32">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ash">
                  Filed under
                </span>
                <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                  <ColophonRow label="Section" value={post.category} />
                  <ColophonRow label="Published" value={post.date} />
                  <ColophonRow label="Length" value={`${post.read} read`} />
                </div>
                <p className="mt-6 font-sans text-sm leading-relaxed text-ash">
                  Written in-house by the BKT Tyres desk. General guidance only —
                  always check the figures for your own machine against its
                  operator manual.
                </p>
                <Link
                  to="/products"
                  className="group mt-7 inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  Browse the range
                  <Icon.arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ══ ONWARD ════════════════════════════════════════════════════ */}
      {(prev || next) && (
        <section className="border-t border-ink/20 bg-fog">
          <div className="mx-auto max-w-[100rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
                Keep reading
              </span>
              <span className="h-px flex-1 bg-ink/12" />
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-brand"
              >
                All stories
                <Icon.arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>

            <div className="reveal grid gap-x-10 gap-y-12 sm:grid-cols-2">
              {prev && <NextStory post={prev} kicker="Previously" />}
              {next && <NextStory post={next} kicker="Next" />}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
