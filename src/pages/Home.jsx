import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* BKT brand photography (client-supplied). */
import tyreLineup from '../assets/bkt-banner.webp' // product lineup on the road
import tractorField from '../assets/tractor-field.webp' // John Deere on BKT flotation tyres
import monsterTruck from '../assets/bkt-truck.webp' // BKT Monster Jam truck
import tyreDetail from '../assets/tyre-detail.webp' // macro tyre sidewall detail
/* "BKT Monster Truck Tire" by TaurusEmerald, CC BY-SA 4.0, via Wikimedia
   Commons — resized to 1600px. Credited under the Spot a fake photo. */
import bktSidewall from '../assets/bkt-tyre-sidewall.jpg'

const marqueeItems = [
  'Authorized BKT Distributor',
  'Genuine Products',
  'Nationwide Support',
  'Experienced Technical Assistance',
]

const categories = [
  {
    index: '01',
    kicker: 'Agriculture',
    name: 'Field & Farm',
    desc: 'Deep-lug traction that protects the soil and pulls through the season.',
    image: tractorField,
    pos: 'object-center',
  },
  {
    index: '02',
    kicker: 'On / Off Highway',
    name: 'Haul & Transport',
    desc: 'Built to carry heavy loads mile after mile, on the road and off it.',
    image: monsterTruck,
    pos: 'object-center',
  },
  {
    index: '03',
    kicker: 'Industrial & OTR',
    name: 'Site & Handling',
    desc: 'Cut-resistant compounds engineered for the hardest working ground.',
    image: tyreDetail,
    pos: 'object-left',
  },
]

const reasons = [
  {
    icon: 'shield',
    title: 'Genuine BKT, direct',
    desc: 'Sourced straight from the manufacturer. Never grey-market, never a fake.',
  },
  {
    icon: 'warranty',
    title: 'Warranty on every tyre',
    desc: 'Full manufacturer warranty, honoured in full. Buy with total confidence.',
  },
  {
    icon: 'advice',
    title: 'Advice from real people',
    desc: 'Talk load ratings, tread and fitment with a team that actually knows tyres.',
  },
  {
    icon: 'truck',
    title: 'Fast, nationwide dispatch',
    desc: 'Stock moved quickly to your farm, depot, or job site, wherever you are.',
  },
]

const stats = [
  { value: '25+', label: 'Years in the trade' },
  { value: '300+', label: 'Sizes kept in stock' },
  { value: '48h', label: 'Typical dispatch time' },
  { value: '100%', label: 'Genuine BKT product' },
]

/* Stat tiles, one per stat, in the BKT logo's three greens then white —
   the band sits on a dark photo, so a carbon tile would disappear. */
const statSlabs = [
  'bg-brand-glow text-carbon',
  'bg-[#22b14c] text-white',
  'bg-brand text-white',
  'bg-white text-carbon',
]

/* Counts a stat like '300+' up from 0 the first time it scrolls into view.
   Reduced motion, or no IntersectionObserver, shows the final value. */
function CountUp({ value }) {
  const [, num, suffix] = value.match(/^(\d+)(.*)$/)
  const target = Number(num)
  const ref = useRef(null)
  const [n, setN] = useState(target)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setN(0)
    let raf
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / 1400)
          setN(Math.round(target * (1 - Math.pow(1 - p, 4))))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target])

  return (
    <span ref={ref} className="tabular-nums" aria-label={value}>
      <span aria-hidden="true">
        {n}
        {suffix}
      </span>
    </span>
  )
}

const faqs = [
  {
    q: 'Are these genuine BKT tyres?',
    a: 'Every tyre we sell is genuine BKT, sourced directly from the manufacturer — never grey-market, never a fake — and it carries the full manufacturer warranty.',
  },
  {
    q: 'Do you deliver nationwide?',
    a: 'Yes. We move stock quickly to your farm, depot, or job site wherever you are, with a typical dispatch time of around 48 hours.',
  },
  {
    q: 'Can you help me choose the right size?',
    a: 'Absolutely. Tell us the machine and the ground it works, and our team will talk you through load ratings, tread pattern, and fitment to match the right tyre.',
  },
  {
    q: 'What warranty comes with the tyres?',
    a: 'Every tyre is covered by the full BKT manufacturer warranty, honoured in full — so you can buy with total confidence.',
  },
  {
    q: 'Do you stock tubes and tubeless options?',
    a: 'We keep a broad range in stock across tube and tubeless fitments, in over 300 sizes. If we do not have your size on the shelf, we will source it fast.',
  },
]

/* Spot a fake: checks a buyer can make. `box` is the marking on the tyre
   photo as [x, y, width, height] in percent of the 4:3 frame the square
   photo is cropped to; `zoom` is how far the photo zooms into it when the
   check is active. `origin` (optional) is the point it zooms about —
   the box's centre by default. */
const fakeChecks = [
  {
    title: 'A crisp BKT mark',
    desc: 'Sharp, even lettering with clean edges. Blurred, uneven or peeling branding is a warning sign.',
    box: [35, 17.5, 21, 16.5],
    zoom: 2.2,
  },
  {
    title: 'Moulded into the rubber',
    desc: 'Moulded into the tyre itself, not just printed on. Raised letters should be deep and crisp.',
    box: [21.5, 52.5, 14, 25],
    zoom: 2,
    origin: [28.5, 90],
  },
  {
    title: 'Size and date code',
    desc: 'Check the size and the week/year date code. Very old stock, or a code ground off, means walk away.',
    box: [70.5, 26.5, 11, 32],
    zoom: 1.9,
  },
]


const pad = (n) => String(n + 1).padStart(2, '0')

/* Home's own section marker: a dot and a rule fading into the label on each
   side. `tone` picks the glow green for the dark sections, `align` centers it
   or lets it sit left. `className` is for per-instance nudges. */
const Kicker = ({ children, tone = 'dark', align = 'center', className = '' }) => {
  const light = tone === 'light'
  return (
    <div
      className={`flex items-center gap-4 ${
        align === 'center' ? 'justify-center' : ''
      } ${className}`}
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-brand-glow' : 'bg-brand'}`} />
        <span
          className={`h-px w-10 bg-gradient-to-r from-transparent ${
            light ? 'to-brand-glow' : 'to-brand'
          }`}
        />
      </span>
      <span
        className={`font-sans text-sm font-bold uppercase tracking-[0.25em] ${
          light ? 'text-brand-glow' : 'text-brand'
        }`}
      >
        {children}
      </span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span
          className={`h-px w-10 bg-gradient-to-l from-transparent ${
            light ? 'to-brand-glow' : 'to-brand'
          }`}
        />
        <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-brand-glow' : 'bg-brand'}`} />
      </span>
    </div>
  )
}

/* ── Why BKT seal parts ──────────────────────────────────────────────
   Line icons on a 24px grid, drawn in currentColor. */
const REASON_ICONS = {
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  warranty: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.5 9l1.8 1.8L14.8 7.5" />
      <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" />
    </>
  ),
  advice: (
    <>
      <path d="M4 5h16v10H9l-5 4V5z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v9H2z" />
      <path d="M13 9h4l3 3v3h-7" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </>
  ),
}

/* One promise beside the seal. Left-hand items mirror (icon nearest the
   seal) and slide in from the left; right-hand ones from the right. */
const WhyItem = ({ reason, side, order }) => (
  <li
    className={`why-item group flex items-start gap-5 ${
      side === 'left' ? 'why-from-l lg:flex-row-reverse lg:text-right' : 'why-from-r'
    }`}
    style={{ '--why-delay': `${750 + order * 150}ms` }}
  >
    <span data-why-icon className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-brand-glow transition-colors duration-300 group-hover:border-brand-glow group-hover:bg-brand group-hover:text-white">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {REASON_ICONS[reason.icon]}
      </svg>
    </span>
    <div>
      <h3 className="font-display text-3xl font-bold uppercase leading-none">
        {reason.title}
      </h3>
      <p className="mt-2 max-w-xs font-sans text-base leading-relaxed text-white/65 lg:ml-auto">
        {reason.desc}
      </p>
    </div>
  </li>
)

/* Connectors: one plain hairline from each promise's icon straight to
   the seal's outer ring. Positions come from layout offsets (not bounding boxes), so
   the slide-in transforms don't skew them; re-measured on resize. Each
   line draws in once on reveal. Desktop only — below lg the layout stacks. */
const WhyConnectors = () => {
  const svgRef = useRef(null)
  const [paths, setPaths] = useState([])
  useLayoutEffect(() => {
    // the stage is this layer's parent (a parent ref is not attached yet
    // when a child's layout effect runs)
    const stage = svgRef.current?.parentElement
    if (!stage) return
    const offset = (node) => {
      let x = 0
      let y = 0
      while (node && node !== stage) {
        x += node.offsetLeft
        y += node.offsetTop
        node = node.offsetParent
      }
      return [x, y]
    }
    const measure = () => {
      const seal = stage.querySelector('[data-why-seal]')
      if (!seal) return
      const [sealX, sealY] = offset(seal)
      const cx = sealX + seal.offsetWidth / 2
      const cy = sealY + seal.offsetHeight / 2
      const r = seal.offsetWidth * 0.48 // outer ring of the seal
      setPaths(
        [...stage.querySelectorAll('[data-why-icon]')].map((icon) => {
          const [ix, iy] = offset(icon)
          const left = ix + icon.offsetWidth / 2 < cx
          const sx = left ? ix + icon.offsetWidth : ix
          const sy = iy + icon.offsetHeight / 2
          const a = Math.atan2(sy - cy, sx - cx)
          const ex = cx + r * Math.cos(a)
          const ey = cy + r * Math.sin(a)
          return `M${sx} ${sy} L${ex} ${ey}`
        }),
      )
    }
    measure()
    // Web fonts arriving after first paint reflow the promise text and move
    // the icons without necessarily resizing the stage, so also watch each
    // promise and the seal, and re-measure once fonts and images settle.
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    stage.querySelectorAll('[data-why-icon]').forEach((icon) => ro.observe(icon.parentElement))
    const seal = stage.querySelector('[data-why-seal]')
    if (seal) ro.observe(seal)
    let alive = true
    document.fonts?.ready.then(() => alive && measure())
    window.addEventListener('load', measure)
    return () => {
      alive = false
      ro.disconnect()
      window.removeEventListener('load', measure)
    }
  }, [])

  return (
    <svg ref={svgRef} className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} className="why-connector" d={d} pathLength="1" style={{ '--why-line-delay': `${600 + i * 120}ms` }} />
      ))}
    </svg>
  )
}

/* The seal: a ring of sidewall lettering that turns slowly around a
   solid green disc. */
const WhySeal = () => (
  <div data-why-seal className="why-seal relative mx-auto aspect-square w-64 sm:w-72">
    <div className="why-ring absolute inset-0">
      <svg viewBox="0 0 200 200" className="why-spin h-full w-full text-white/80" aria-hidden="true">
        <defs>
          <path id="why-seal-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity=".25" />
        <text className="fill-current font-sans text-[11px] font-bold">
          <textPath href="#why-seal-path" textLength="510" lengthAdjust="spacing">
            GENUINE BKT • AUTHORISED DISTRIBUTOR • NEPAL •{' '}
          </textPath>
        </text>
      </svg>
    </div>
    <div className="why-disc absolute inset-[22%] grid place-items-center rounded-full bg-brand text-center">
      <div>
        <svg
          viewBox="0 0 24 24"
          className="mx-auto h-10 w-10 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
          <path className="why-tick" pathLength="1" d="M8.5 12l2.5 2.5 4.5-5" />
        </svg>
        <span className="why-label mt-2 block font-display text-3xl font-bold uppercase leading-none text-white">
          100%
        </span>
        <span className="why-label block font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
          Genuine
        </span>
      </div>
    </div>
  </div>
)

/* Spot a fake: the sidewall photo beside a numbered list of checks.
   Hovering, focusing or tapping a check zooms the photo onto that marking
   — nothing is drawn over it; the caption names it. Zoom timing lives in
   index.css under "spot a fake". */
const SpotFake = () => {
  const [active, setActive] = useState(0)
  const check = fakeChecks[active]
  // Zoom about the marking's centre, unless the check moves the origin
  // (e.g. to keep the marking clear of the caption).
  const [x, y, w, h] = check.box
  const [ox, oy] = check.origin ?? [x + w / 2, y + h / 2]
  return (
    <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
      <div className="reveal">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-carbon">
          <div
            className="fake-zoom absolute inset-0"
            style={{ '--z': check.zoom, transformOrigin: `${ox}% ${oy}%` }}
          >
            <img
              src={bktSidewall}
              alt="A large BKT tyre showing white BKT lettering, the BKT name moulded into the shoulder and the size code on the sidewall"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-carbon/90 to-transparent" />
          <p className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-end gap-4 text-white sm:bottom-8 sm:left-8">
            <span className="font-display text-5xl font-black italic leading-[0.8] text-brand-glow sm:text-6xl">{pad(active)}</span>
            <span className="font-display text-2xl font-bold uppercase leading-none sm:text-3xl">{check.title}</span>
          </p>
        </div>
        <p className="mt-3 font-sans text-xs text-ash">
          Photo:{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:BKT_Monster_Truck_Tire.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ink/20 underline-offset-2 hover:text-brand"
          >
            TaurusEmerald
          </a>
          ,{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ink/20 underline-offset-2 hover:text-brand"
          >
            CC BY-SA 4.0
          </a>
        </p>
      </div>

      <div className="reveal">
        <ol className="border-b border-ink/10">
          {fakeChecks.map((c, i) => {
            const on = active === i
            return (
              <li key={c.title} className="relative border-t border-ink/10">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-brand transition-transform duration-500 ease-out ${
                    on ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-5 py-6 pl-5 pr-4 text-left transition-colors duration-300 sm:gap-6 sm:pl-7 ${
                    on ? 'bg-brand/[0.04]' : 'hover:bg-fog'
                  }`}
                >
                  <span
                    className={`font-display mt-0.5 text-3xl font-black tabular-nums leading-none transition-colors duration-300 sm:text-4xl ${
                      on ? 'text-brand' : 'text-ink/20'
                    }`}
                  >
                    {pad(i)}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block pt-1 font-display text-xl font-bold uppercase leading-tight tracking-tight transition-colors duration-300 sm:text-2xl ${
                        on ? 'text-brand' : 'text-ink'
                      }`}
                    >
                      {c.title}
                    </span>
                    <span className="mt-2 block font-sans text-base leading-relaxed text-ash">
                      {c.desc}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pl-5 sm:pl-7">
          <p className="font-sans text-base text-ash">Still not sure? Send us a photo of the sidewall.</p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.2em] text-brand"
          >
            Ask our team
            <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)
  const [flipped, setFlipped] = useState(-1) // range card turned over by tap

  /* Reveal-on-scroll: toggle `.is-visible` as `.reveal` elements enter view.
     Content must never stay hidden — if IntersectionObserver never reports
     (some embedded webviews / preview panes don't run it), a failsafe reveals
     everything so the page is never stuck at opacity 0. */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
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
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-carbon text-white">
        <img
          src={tyreLineup}
          alt="The BKT AGRIMAX tyre range lined up on a country road through the fields"
          className="anim-fade absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform: 'scale(1.08) translateY(3%)' }}
          fetchPriority="high"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-carbon/85 via-carbon/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-carbon/85 via-carbon/30 to-transparent" />

        {/* Credentials rail — hairline-ruled ticker pinned to the hero's bottom edge.
            Items are duplicated once so the -50% marquee loops seamlessly; the second
            half is aria-hidden so the list is announced only once. */}
        <div className="marquee-pause absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/12 py-3.5 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
          <ul className="flex w-max animate-marquee-slow items-center">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <li
                key={i}
                aria-hidden={i >= marqueeItems.length}
                className="flex shrink-0 items-center"
              >
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 sm:text-xs">
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="mx-8 h-2.5 w-[2px] shrink-0 bg-brand-glow/80 sm:mx-12"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Our Range ────────────────────────────────────────── */}
      {/* Heading, then flip cards: photo on the front; hover (or tap on touch screens)
          turns a card over to a brand-green back with the details and the
          link. Flip styles live in index.css under "range flip cards". */}
      <section className="relative overflow-hidden bg-white pt-12 pb-24 sm:pt-16 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <Kicker>Our Range</Kicker>
          </div>
          <h2 className="reveal font-wide mt-6 text-center text-[clamp(2.5rem,5vw,4.25rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink">
            A tyre for every
            <br />
            <span className="text-brand">terrain you work</span>
          </h2>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {categories.map((cat, i) => (
              <div
                key={cat.index}
                className="reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div
                  className="range-flip aspect-[3/4] cursor-pointer"
                  data-flipped={flipped === i}
                  onClick={() => setFlipped((f) => (f === i ? -1 : i))}
                >
                  <div className="range-flip-inner relative h-full w-full">
                    {/* front */}
                    <div className="range-face absolute inset-0 overflow-hidden rounded-3xl bg-steel">
                      <img
                        src={cat.image}
                        alt={`${cat.kicker} tyre application`}
                        className={`h-full w-full object-cover ${cat.pos}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-transparent to-transparent" />
                      <span className="absolute left-6 top-6 rounded-full bg-white px-3 py-1 font-mono text-xs font-bold text-ink">
                        {cat.index}
                      </span>
                      <span
                        className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                          <path d="M21 3v5h-5" />
                        </svg>
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-7">
                        <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-glow">
                          {cat.kicker}
                        </span>
                        <h3 className="mt-2 font-display text-5xl font-bold uppercase leading-[0.9] text-white">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    {/* back */}
                    <div className="range-face range-back absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-brand p-8 text-white">
                      <span className="pointer-events-none absolute -bottom-10 -right-4 font-display text-[14rem] font-bold leading-none text-white/10">
                        {cat.index}
                      </span>
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                        {cat.kicker}
                      </span>
                      <h3 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9]">
                        {cat.name}
                      </h3>
                      <div className="mt-6 h-px bg-white/25" />
                      <p className="mt-6 max-w-xs font-sans text-base leading-relaxed text-white/85">
                        {cat.desc}
                      </p>
                      <Link
                        to="/products"
                        onClick={(e) => e.stopPropagation()}
                        className="group relative mt-auto inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-wide text-brand"
                      >
                        <span className="absolute inset-0 origin-left scale-x-0 bg-carbon transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        <span className="relative transition-colors duration-500 group-hover:text-white">
                          Explore range
                        </span>
                        <svg
                          className="relative h-4 w-4 transition-[transform,color] duration-500 group-hover:translate-x-1.5 group-hover:text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-14 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1 font-sans text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-brand hover:text-brand"
            >
              View the full catalogue
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why BKT ───────────────────────────────────────────── */}
      {/* A turning "genuine" seal at the centre with two promises either
          side, wired to it by hairlines. The seal assembles itself on
          scroll (ring turns in, disc grows, tick draws, lines extend,
          promises slide in toward it) — choreography lives in index.css
          under "Why BKT seal". */}
      <section className="relative overflow-hidden bg-carbon text-white">
        <img
          src={tyreDetail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-15"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon via-carbon/60 to-carbon" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20 sm:pb-32 lg:px-8">
          <div className="reveal mx-auto max-w-3xl text-center">
            <Kicker tone="light">Why BKT</Kicker>
            <h2 className="font-wide mt-6 text-balance text-[clamp(2.5rem,5vw,4.25rem)] font-bold uppercase leading-[0.95] tracking-tight">
              Genuine product,
              <br /> <span className="text-brand">people who back it</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-white/70 sm:text-lg">
              Anyone can sell you a tyre. We make sure it&rsquo;s the right one,
              and we&rsquo;re here when it matters.
            </p>
          </div>

          <div className="reveal why-stage relative mt-20 grid items-center gap-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
            <WhyConnectors />
            <ul className="grid gap-12">
              {reasons.slice(0, 2).map((reason, i) => (
                <WhyItem key={reason.title} reason={reason} side="left" order={i} />
              ))}
            </ul>

            <div className="relative order-first lg:order-none">
              <WhySeal />
            </div>

            <ul className="grid gap-12">
              {reasons.slice(2).map((reason, i) => (
                <WhyItem key={reason.title} reason={reason} side="right" order={i} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Spot a fake ───────────────────────────────────────── */}
      <section className="relative bg-white pb-24 pt-16 text-ink sm:pb-32 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mx-auto max-w-3xl text-center">
            <Kicker>Spot a fake</Kicker>
            <h2 className="font-wide mt-6 text-balance text-[clamp(2.5rem,5vw,4.25rem)] font-bold uppercase leading-[0.95] tracking-tight">
              Know it&rsquo;s genuine
              <br />
              <span className="text-brand">before you fit it</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-ash sm:text-lg">
              Counterfeit and grey-market tyres look the part until they fail.
              Three checks on the tyre itself that take less than a minute.
            </p>
          </div>
          <SpotFake />
        </div>
      </section>

      {/* ── Stats band: logo slabs ────────────────────────────────
          Slanted tiles in the three greens of the BKT mark, plus white
          for the fourth, over the darkened field photo. The tile is skewed and its contents skewed back
          so the type stays upright. */}
      <section className="relative overflow-hidden bg-carbon py-20 sm:py-28">
        <img
          src={tractorField}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-carbon/85" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:px-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="reveal" style={{ transitionDelay: `${i * 130}ms` }}>
                <div
                  className={`-skew-x-[9deg] rounded-[1.6rem_0.4rem_1.6rem_0.4rem] px-6 py-10 sm:py-14 ${statSlabs[i]}`}
                >
                  <div className="skew-x-[9deg] text-center">
                    <div className="font-display text-[clamp(3.6rem,7vw,6.5rem)] font-black italic leading-[0.85]">
                      <CountUp value={stat.value} />
                    </div>
                    <div className="mt-4 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip bg-white pb-24 pt-20 text-ink lg:pt-24">
        {/* Atmosphere: faint brand glow + a giant watermark index */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-8 h-[32rem] w-[32rem] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #007735 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
          {/* Left: heading + contact card, sticky on desktop. Pulled a little
              outside the container's gutter from `lg` up so the block sits
              closer to the page edge than the section padding allows. */}
          <div className="reveal self-start lg:sticky lg:top-28">
            <Kicker align="left" className="ml-4">
              FAQ
            </Kicker>
            <h2 className="font-wide mt-6 text-5xl font-bold uppercase leading-[0.88] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="line-mask">
                <span>Answers,</span>
              </span>
              <span className="line-mask">
                <span className="text-brand">straight up</span>
              </span>
            </h2>
            {/* Measure capped just above the column width, so from `lg` up the
                paragraph fills the same block the headline does — the two
                shared a left edge already but not a right one. */}
            <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-ash">
              Everything people ask us most about buying and running BKT tyres.
              Can&apos;t find yours? Our team is here to help.
            </p>

          </div>

          {/* Right: editorial numbered accordion — hairline rules, no cards */}
          <div className="reveal border-b border-ink/10">
            {faqs.map((faq, i) => {
              const open = openFaq === i
              return (
                <div
                  key={faq.q}
                  className={`group relative border-t border-ink/10 transition-colors duration-300 ${
                    open ? 'bg-brand/[0.04]' : 'hover:bg-fog'
                  }`}
                >
                  {/* animated green active bar */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-brand transition-transform duration-300 ease-out ${
                      open ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-5 py-6 pl-5 pr-4 text-left sm:gap-6 sm:pl-7"
                    >
                      <span
                        className={`font-display mt-0.5 text-3xl font-black tabular-nums leading-none transition-colors duration-300 sm:text-4xl ${
                          open ? 'text-brand' : 'text-ink/20 group-hover:text-ink/35'
                        }`}
                      >
                        {pad(i)}
                      </span>
                      <span
                        className={`flex-1 pt-1 font-display text-xl font-bold uppercase leading-tight tracking-tight transition-colors duration-300 sm:text-2xl ${
                          open ? 'text-brand' : 'text-ink'
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          open
                            ? 'rotate-180 border-brand bg-brand text-white'
                            : 'border-ink/15 text-ink group-hover:border-ink/40'
                        }`}
                        aria-hidden="true"
                      >
                        {/* horizontal bar (always) + vertical bar that collapses when open */}
                        <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
                        <span
                          className={`absolute h-3.5 w-[2px] rounded-full bg-current transition-transform duration-300 ${
                            open ? 'scale-y-0' : 'scale-y-100'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 pl-5 pr-10 font-sans text-base leading-relaxed text-ash sm:pl-[4.75rem]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
