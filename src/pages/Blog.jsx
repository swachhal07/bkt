import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ISSUE, posts } from '../data/posts'

/* Hallmark · genre: editorial · macrostructure: Photo-led magazine grid
 * scope: Blog.jsx (index) · tone: printed journal, photography first
 * theme: BKT brand tokens (preserved — client palette, no catalog swap)
 * archetypes: centred type masthead (matches About.jsx) · feature plate
 *             · even two-column story grid
 * enrichment: none invented — client photography only, ungraded
 * motion: reveal fade-up + anim-rise entrance + masked line reveal on the
 *         masthead headline (shared with About.jsx)
 * nav/footer: n/a — owned by Navbar.jsx / Footer.jsx
 *
 * Images lead: each story is a plate first and a headline second, and every
 * plate is a link to /blog/:slug — no inline expansion, no dead ends.
 */

const Icon = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
}

/* Button: translucent fill and a hairline at rest, with a green panel wiping
   in from the left on hover. Same component, same spec, as About.jsx — the
   two mastheads are built to one spec, so anything that changes here changes
   there too. */
const WipeLink = ({ to, children }) => (
  <Link
    to={to}
    className="group relative inline-flex items-center gap-3 overflow-hidden border border-ink/20 bg-ink/[0.02] px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
  >
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
    />
    <span className="relative">{children}</span>
    <Icon.arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
  </Link>
)

/* Ruled along the foot of the masthead: label above value, divided by
   hairlines. The About page's facts rail, carrying this page's facts. */
const journalFacts = [
  { label: 'Issue', value: `No. ${ISSUE.no}` },
  { label: 'Season', value: ISSUE.season },
  { label: 'Stories', value: `${posts.length} filed` },
  { label: 'Written', value: 'In-house, at the desk' },
]

/* Category · date · read-time byline. `tone: light` = marks on a dark plate. */
const Byline = ({ post, tone = 'dark' }) => {
  const onDark = tone === 'light'
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px]">
      <span className={onDark ? 'text-brand-glow' : 'text-brand'}>{post.category}</span>
      <span className={`h-1 w-1 ${onDark ? 'bg-white/30' : 'bg-ink/25'}`} aria-hidden="true" />
      <span className={onDark ? 'text-white/60' : 'text-ash'}>{post.date}</span>
      <span className={`h-1 w-1 ${onDark ? 'bg-white/30' : 'bg-ink/25'}`} aria-hidden="true" />
      <span className={onDark ? 'text-white/60' : 'text-ash'}>{post.read}</span>
    </div>
  )
}

/* Story plate. `size` only sets the image height — everything else is shared, so
   a feature and a small entry stay recognisably the same object. */
const Story = ({ post, size = 'md', index }) => {
  /* Aspect ratio, not a fixed height: equal-width columns then give identical
     plates, so nothing in a row can end up taller than its neighbour. */
  const heights = {
    lg: 'aspect-[16/9] sm:aspect-[21/9]',
    md: 'aspect-[16/10]',
  }

  return (
    <article className="reveal group flex h-full flex-col">
      <Link
        to={`/blog/${post.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {/* Plate: ungraded client photography, mounted rather than blended. */}
        <div className={`relative overflow-hidden bg-carbon ${heights[size]}`}>
          <img
            src={post.img}
            alt={post.alt}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            loading={size === 'lg' ? 'eager' : 'lazy'}
          />
          {/* Index tab, printed straight onto the plate. */}
          {index != null && (
            <span className="pointer-events-none absolute left-0 top-0 bg-brand px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white">
              {String(index).padStart(2, '0')}
            </span>
          )}
          {/* Green rule wipes across the foot of the plate on hover. */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </div>

        {/* flex-1 + mt-auto below: the "read" line sits on a shared baseline
            across a row however long the headlines run. */}
        <div className="flex flex-1 flex-col pt-5">
          <Byline post={post} />
          <h3
            className={`font-display mt-3 font-bold uppercase leading-[1.02] tracking-tight text-ink transition-colors group-hover:text-brand ${
              size === 'lg'
                ? 'text-[clamp(1.9rem,3.4vw,3.25rem)]'
                : 'text-[clamp(1.4rem,2vw,2rem)]'
            }`}
          >
            {post.title}
          </h3>
          <p
            className={`mt-3 font-sans leading-relaxed text-ash ${
              size === 'lg' ? 'max-w-2xl text-base sm:text-lg' : 'max-w-xl text-[15px]'
            }`}
          >
            {post.excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-2.5 pt-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-brand">
            Read the story
            <Icon.arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </article>
  )
}

export default function Blog() {
  /* Newest first, straight from the data — posts.js does not sort. The topic
     filter that used to sit in a band under the masthead is gone, so every
     story is always listed and there is no filtered/empty state to handle. */
  const [lead, ...rest] = posts

  /* Reveal-on-scroll. Content must never stay hidden — if IntersectionObserver
     never reports (some embedded webviews don't run it), a failsafe reveals all. */
  useEffect(() => {
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
  }, [])

  return (
    <>
      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      {/* Built to the About masthead's spec — one screen of white (viewport
          height less the fixed navbar), type centred on the measure, and a
          full-bleed ruled rail at the foot. The issue/season/count strip that
          used to sit above it is gone; that data now lives in the rail, which
          is where About keeps its facts. */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col bg-white">
        <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
          {/* Same marker Home and About use: dot and a rule fading into the
              label on each side. */}
          <div className="anim-rise flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand" />
            </span>
            <span className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-brand">
              From the field
            </span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
          </div>

          {/* Three lines, each tracking down from behind its own mask on load —
              the same entrance, and now the same line count, as About. */}
          <h1 className="font-wide anim-lines mt-8 text-[clamp(2.5rem,min(8.5vw,12vh),6rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink">
            <span className="line-mask">
              <span>Advice we&rsquo;d</span>
            </span>
            <span className="line-mask">
              <span>give you</span>
            </span>
            <span className="line-mask">
              <span className="text-brand">in person.</span>
            </span>
          </h1>

          <p
            className="anim-rise mt-8 max-w-[54ch] font-sans text-base leading-relaxed text-ash sm:text-lg text-pretty"
            style={{ animationDelay: '420ms' }}
          >
            Fitment guides, product news and hard-won practical advice — written
            for the people who actually run the machines. No sales copy dressed up
            as an article.
          </p>

          <div
            className="anim-rise mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: '520ms' }}
          >
            {lead && <WipeLink to={`/blog/${lead.slug}`}>Read the lead story</WipeLink>}
            <WipeLink to="/contact">Talk to the desk</WipeLink>
          </div>
        </div>

        {/* Facts rail — ruled top and bottom, since the section below it is
            also white and there is no photograph edge to divide them. */}
        <div
          className="anim-rise border-y border-ink/12"
          style={{ animationDelay: '620ms' }}
        >
          <dl className="mx-auto grid max-w-[100rem] grid-cols-2 divide-ink/10 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-10">
            {journalFacts.map((f) => (
              <div key={f.label} className="py-5 text-center lg:px-8 lg:py-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
                  {f.label}
                </dt>
                <dd className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink sm:text-[13px]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ FEATURE + GRID ════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[100rem] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-16 lg:px-10">
          {lead && (
            <>
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">
                  Lead story
                </span>
                <span className="h-px flex-1 bg-ink/12" />
              </div>
              <Story post={lead} size="lg" index={posts.indexOf(lead) + 1} />
            </>
          )}

          {rest.length > 0 && (
            <>
              <div className="mb-6 mt-20 flex items-center gap-4 sm:mt-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
                  Also in this issue
                </span>
                <span className="h-px flex-1 bg-ink/12" />
              </div>

              {/* Equal columns, tops aligned, identical plates. The feature above
                  carries the asymmetry; the index below stays even. */}
              <div className="grid items-stretch gap-x-10 gap-y-16 sm:grid-cols-2 sm:gap-y-20">
                {rest.map((p) => (
                  <Story key={p.slug} post={p} size="md" index={posts.indexOf(p) + 1} />
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </>
  )
}
