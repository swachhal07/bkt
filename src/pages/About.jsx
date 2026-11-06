import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* Client-supplied photography — each photograph used once. */
import tyreDetail from '../assets/tyre-detail.webp' // BKT sidewall close-up
import tractorField from '../assets/tractor-field.webp' // John Deere on BKT Flotation 648
import bktTruck from '../assets/bkt-truck.webp' // BKT display truck
import bktLogo from '../assets/logo-solid.png' // BKT lockup, dark tagline
import dugarLogoHd from '../assets/dugar-logo-hd.png' // 1899px, from mvdugar.com/dugar.svg

/* ────────────────────────────────────────────────────────────────────
   ABOUT — redesigned to sit in the same world as Home rather than in a
   printed-document world of its own.

   What changed and why: the previous version was a light spec sheet —
   a mono document strip, a ruled "Sheet 01 / Sheet 02" index above every
   section, white from top to bottom. Read next to Home (carbon hero,
   full-bleed photography, green weight) it looked like a different site,
   and the ruled-index-per-section device was scaffolding rather than
   voice. Both are gone.

   The page now runs on weight and colour instead:

     1  HERO          white, centred, no imagery — one screen carried by
                      type alone, headline tracking down line by line,
                      facts ruled along the bottom edge
     2  THE TRADE     carbon — four skewed terrain photo slabs; hover opens one
     3  COMMITMENTS   white — zigzag photo / text rows with skewed number tiles
     4  THE GROUP     carbon — MV Dugar and BKT as two magnetic discs;
                      hovering one swaps the line beneath

   Below the hero this is three folds, not five. The earlier page put a
   type-only spread directly under a type-only hero, so nothing changed
   gear after the masthead, then spent a whole section on a photograph
   with a caption under it and another on a fog-coloured colophon. The
   spread and the photograph are now one composition (2), and the colophon
   is the first band of the finale (4). Every line of copy survived the
   merge; the fog surface did not, because white → green → carbon is a
   harder run without it.

   The hero is deliberately empty of everything but type — the client
   asked for white and centred, so the composition has to hold on
   letterforms and air, and the photography starts immediately below it.
   Only the hero carries a kicker.

   Copy: no figures. Years-in-trade, tyres-sold, dealer counts and
   satisfaction scores were removed at the client's instruction and are
   not reinstated. Every claim below already appears on Home or Contact.
   ──────────────────────────────────────────────────────────────────── */

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/* Button: translucent fill and a hairline at rest, with a panel wiping in
   from the left on hover. `tone` flips it for carbon surfaces, where the
   wipe lands on the light green from the logo rather than on brand green
   (which is too close to carbon in value to register). */
const WipeLink = ({ to, children, tone = 'light' }) => {
  const onDark = tone === 'dark'
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center gap-3 overflow-hidden border px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        onDark
          ? 'border-white/35 bg-white/[0.08] text-white hover:text-carbon focus-visible:outline-brand-glow'
          : 'border-ink/20 bg-ink/[0.02] text-ink hover:text-white focus-visible:outline-brand'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none ${
          onDark ? 'bg-brand-glow' : 'bg-brand'
        }`}
      />
      <span className="relative">{children}</span>
      <Arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
    </Link>
  )
}

/* Same marker Home uses: a dot and a rule fading into the label on each
   side. Used once on this page, in the hero — not above every section. */
const Kicker = ({ children }) => (
  <div className="flex items-center justify-center gap-4">
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand" />
    </span>
    <span className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-brand">
      {children}
    </span>
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand" />
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
    </span>
  </div>
)

/* Ruled along the bottom edge of the hero: label above value, divided by
   hairlines. The instrument-panel reading Home's ticker rail gets, but
   static, because this is reference rather than atmosphere — and here it
   also does the work of closing the hero off, since there is no
   photograph edge to end it. */
const facts = [
  { label: 'Role', value: 'Authorised BKT distributor' },
  { label: 'Based', value: 'Kathmandu, Nepal' },
  { label: 'Hours', value: 'Sun–Fri · 09–18' },
  { label: 'Dispatch', value: 'Nationwide · 48h' },
]

/* Number tile on each commitment photo, in the greens of the logo. */
const commitmentTone = ['bg-brand-glow text-carbon', 'bg-[#22b14c] text-white', 'bg-brand text-white']

/* Each commitment is traceable to wording already on Contact — none of it is
   new claim-making. */
const commitments = [
  {
    head: 'Genuine stock',
    body: 'Every tyre we sell is genuine BKT, bought through the proper channel. Read the sidewall when it arrives — the size, the load index, the manufacturing week. If those markings are ever incomplete or inconsistent, it did not come from us.',
    img: tyreDetail,
    pos: 'object-[55%_60%]',
    alt: 'Close-up of a BKT tyre sidewall',
  },
  {
    head: 'Advice before the sale',
    body: 'Tell us the machine and the ground it works, and we size from the axle load rather than from whatever is in the rack. Sometimes that means a smaller order than you came in for, or a straight answer that we do not have the right tyre today.',
    img: tractorField,
    pos: 'object-[55%_62%]',
    alt: 'A tractor on BKT Flotation 648 tyres in a meadow',
  },
  {
    head: 'The warranty, honoured',
    body: 'Every tyre carries the full manufacturer warranty and we honour it in full. A claim is a conversation with the same desk that sold you the tyre — not a form, and not somebody else’s problem.',
    img: bktTruck,
    pos: 'object-center',
    alt: 'A BKT-liveried display truck',
  },
]

/* ── The Trade · terrain slabs ──────────────────────────────────────── */

/* Terrain photographs — all free under the Unsplash License, hotlinked
   from Unsplash's CDN (permitted by their API guidelines). Swap for the
   client's own Nepal photographs when they are supplied.
     Hill roads     unsplash.com/photos/a-truck-navigates-a-narrow-mountain-road-9AFp_3XuUgk
     Monsoon mud    unsplash.com/photos/a-jeep-driving-through-a-muddy-area-3QsGS2Vsab4
     Broken tarmac  unsplash.com/photos/severely-cracked-and-damaged-asphalt-pavement-in-black-and-white-Y0K03LqiSFc
     Heavy loads    unsplash.com/photos/a-truck-with-a-load-of-sand-bags-on-the-back-of-it-MwSbimkm50I
   `grey` asks Unsplash's CDN for a desaturated copy (sat=-100), so the
   closed slabs never run a CSS filter. */
const unsplash = (id, grey = false) =>
  `https://images.unsplash.com/${id}?fm=jpg&q=70&w=1200&auto=format&fit=crop${grey ? '&sat=-100' : ''}`

/* Each terrain carries one line on what that ground does to a tyre. */
const terrain = [
  { name: 'Hill roads', line: 'Long climbs, tight bends and hot brakes all the way down.', id: 'photo-1758701321116-985af34d993f', alt: 'A truck on a narrow road cut into a mountainside' },
  { name: 'Monsoon mud', line: 'Three months of rain, and roads that turn to clay.', id: 'photo-1670450268251-9d7afb07a74a', alt: 'A jeep driving through deep mud' },
  { name: 'Broken tarmac', line: 'Potholes and sharp edges that find a weak sidewall.', id: 'photo-1784548789954-655c9a9e1a64', alt: 'Cracked and broken asphalt' },
  { name: 'Heavy loads', line: 'Trucks loaded past what the road was built for.', id: 'photo-1709967244464-914490ecea95', alt: 'A truck loaded high with sandbags' },
]

/* The bar under the open slab, in the greens of the logo (as Home's stat slabs). */
const slabTone = ['bg-brand-glow', 'bg-[#22b14c]', 'bg-brand', 'bg-white']

/* Home's skewed slab shape, one photo
   per terrain. On desktop the open slab is wide and in colour with its name
   and line; the others are narrow, greyscale, number only. Hover, focus or
   tap opens one. Below lg the slabs stack upright with everything shown.

   Kept smooth by doing as little as possible per frame while the slabs
   resize: the photos are a fixed width centred in their slab (the slab
   only changes how much of the photo it clips, so nothing is rescaled),
   colour ↔ grey is an opacity crossfade between two images rather than a
   filter, and hover waits a moment before switching so a cursor sweeping
   across the row doesn't restart the animation on every slab it crosses. */
const TerrainSlabs = () => {
  const [on, setOn] = useState(0)
  const timer = useRef(0)
  const hover = (i) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(i), 90)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <section className="overflow-hidden bg-carbon py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <h2 className="reveal text-center font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          Built for the roads
          <br />
          <span className="text-brand-glow">Nepal actually has.</span>
        </h2>

        <div className="mt-16 flex flex-col gap-3 lg:h-[34rem] lg:flex-row lg:gap-4 lg:px-6" onPointerLeave={() => clearTimeout(timer.current)}>
          {terrain.map((t, i) => {
            const active = on === i
            return (
              <button
                key={t.name}
                type="button"
                aria-pressed={active}
                onPointerEnter={() => hover(i)}
                onFocus={() => setOn(i)}
                onClick={() => setOn(i)}
                className={`relative isolate min-h-[16rem] overflow-hidden rounded-[1.6rem_0.4rem_1.6rem_0.4rem] text-left outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(.16,1,.3,1)] [contain:layout_paint] focus-visible:ring-2 focus-visible:ring-brand-glow motion-reduce:transition-none lg:-skew-x-[9deg] ${active ? 'lg:flex-[2.6]' : 'lg:flex-1'}`}
              >
                <div className="absolute inset-0 lg:inset-auto lg:left-1/2 lg:top-0 lg:h-full lg:w-[56rem] lg:-translate-x-1/2 lg:skew-x-[9deg]">
                  <img
                    src={unsplash(t.id)}
                    alt={t.alt}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 will-change-transform motion-reduce:transition-none ${active ? 'scale-100' : 'lg:scale-110'}`}
                  />
                  <img
                    src={unsplash(t.id, true)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 hidden h-full w-full object-cover transition-[opacity,transform] duration-700 will-change-transform motion-reduce:transition-none lg:block ${active ? 'scale-100 opacity-0' : 'scale-110 opacity-100'}`}
                  />
                </div>
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/25 to-transparent" />
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-2 origin-left transition-transform duration-700 motion-reduce:transition-none ${slabTone[i]} ${active ? 'scale-x-100' : 'scale-x-0'}`}
                />
                <div className="relative flex h-full flex-col justify-end p-7 sm:p-9 lg:skew-x-[9deg] lg:pl-12">
                  <span className="font-display text-5xl font-black italic leading-none text-white/80">0{i + 1}</span>
                  <h3 className={`mt-2 whitespace-nowrap font-wide text-[clamp(1.5rem,2.4vw,2.6rem)] font-extrabold uppercase leading-[0.9] tracking-tight transition-opacity duration-500 ${active ? '' : 'lg:opacity-0'}`}>
                    {t.name}
                  </h3>
                  <p className={`mt-3 max-w-[34ch] font-sans text-base text-white/80 transition-opacity duration-500 lg:w-[34ch] ${active ? 'lg:delay-200' : 'lg:opacity-0'}`}>
                    {t.line}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── The Group · magnetic discs ──────────────────────────────────────── */

/* Chosen from /group-lab (option 7), on carbon at the client's request.
   Just the two marks as discs that lean toward the cursor; hovering one
   grows it, dims the other, and swaps the line underneath for that side's
   sentence. Tap toggles on touch; focus does the same for keyboard. */
const groupLine = 'BKT Tyres is brought to Nepal by the MV Dugar Group — a Nepali business house since 1884.'

const discCopy = {
  null: groupLine,
  mv: 'The group — a Nepali business house since 1884, working across six industries with more than 4,000 people.',
  bkt: 'The brand — genuine BKT tyres for the farm, the site and the road, brought to Nepal since 2021.',
}

const Disc = ({ id, active, setActive, children, className = '' }) => {
  const ref = useRef(null)
  const [off, setOff] = useState({ x: 0, y: 0 })
  const on = active === id
  const dim = active && !on

  /* Magnetic pull: the disc follows the pointer by a fraction of its offset. */
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    setOff({ x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.18 })
  }

  return (
    <button
      ref={ref}
      type="button"
      onPointerEnter={() => setActive(id)}
      onPointerMove={move}
      onPointerLeave={() => {
        setActive(null)
        setOff({ x: 0, y: 0 })
      }}
      onFocus={() => setActive(id)}
      onBlur={() => setActive(null)}
      onClick={() => setActive(on ? null : id)}
      className={`relative grid aspect-square w-[clamp(9rem,24vw,20rem)] place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-brand-glow motion-reduce:!transition-none ${className}`}
      style={{
        transform: `translate(${off.x}px, ${off.y}px) scale(${on ? 1.1 : dim ? 0.86 : 1})`,
        opacity: dim ? 0.55 : 1,
        transition: 'transform 600ms cubic-bezier(.16,1,.3,1), opacity 400ms ease',
      }}
    >
      {children}
    </button>
  )
}

const GroupDiscs = () => {
  const [active, setActive] = useState(null)
  return (
    <section className="overflow-hidden bg-carbon py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 text-center sm:px-6 lg:px-10">
        <h2 className="reveal font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          Part of the <span className="text-brand">MV Dugar Group.</span>
        </h2>
        <div className="reveal mt-16 flex items-center justify-center gap-4 sm:gap-10">
          <Disc id="mv" active={active} setActive={setActive} className="shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]">
            <img src={dugarLogoHd} alt="MV Dugar Group" className="h-full w-full rounded-full" />
          </Disc>
          <span aria-hidden="true" className={`font-wide text-3xl font-extrabold transition-colors duration-500 sm:text-5xl ${active ? 'text-brand-glow' : 'text-white/25'}`}>
            ×
          </span>
          <Disc id="bkt" active={active} setActive={setActive} className="bg-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]">
            <img src={bktLogo} alt="BKT — Growing Together" className="w-[72%]" />
          </Disc>
        </div>
        {/* Caption swaps with the hovered mark */}
        <div className="relative mx-auto mt-14 h-28 max-w-[52ch] sm:h-20">
          {Object.entries(discCopy).map(([k, t]) => (
            <p
              key={k}
              aria-hidden={String(active) !== k}
              className="absolute inset-0 font-sans text-base leading-relaxed text-white/70 transition-[opacity,transform] duration-500 sm:text-lg"
              style={{ opacity: String(active) === k ? 1 : 0, transform: `translateY(${String(active) === k ? 0 : 10}px)` }}
            >
              {t}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <WipeLink to="/leadership" tone="dark">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  /* Reveal-on-scroll, matching Home and Contact: content is visible unless the
     observer runs, and a failsafe reveals everything if it never reports. */
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
      {/* ══ 1 · HERO ═════════════════════════════════════════════════ */}
      {/* One screen of white: viewport height less the fixed navbar (6rem).
          Nothing but type, centred on the measure, with the facts ruled
          across the bottom to give the composition a floor.

          This masthead is the spec the Blog masthead follows — same screen
          height, same type scale, same measure, same full-bleed ruled rail
          at the foot. Change one, change both. */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col bg-white">
        <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
          <div className="anim-rise">
            <Kicker>About BKT Tyres</Kicker>
          </div>

          {/* Each line tracks down from behind its own mask on load — the
              page's one piece of choreography, and the reason the hero
              doesn't need a second device. */}
          <h1 className="font-wide anim-lines mt-8 text-[clamp(2.5rem,min(8.5vw,12vh),6rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink">
            <span className="line-mask">
              <span>The people</span>
            </span>
            <span className="line-mask">
              <span>behind the</span>
            </span>
            <span className="line-mask">
              <span className="text-brand">tyres you run.</span>
            </span>
          </h1>

          <p
            className="anim-rise mt-8 max-w-[54ch] font-sans text-base leading-relaxed text-ash sm:text-lg text-pretty"
            style={{ animationDelay: '420ms' }}
          >
            We supply genuine BKT tyres across Nepal — for the farm, the site and
            the road — and we stand behind every one of them long after it leaves
            the shelf.
          </p>

          <div
            className="anim-rise mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: '520ms' }}
          >
            <WipeLink to="/contact">Talk to the desk</WipeLink>
            <WipeLink to="/products">See the range</WipeLink>
          </div>
        </div>

        {/* Facts rail — ruled top and bottom, since the section below it is
            also white and there is no photograph edge to divide them. */}
        <div
          className="anim-rise border-y border-ink/12"
          style={{ animationDelay: '620ms' }}
        >
          <dl className="mx-auto grid max-w-[100rem] grid-cols-2 divide-ink/10 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-10">
            {facts.map((f) => (
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

      {/* ══ 2 · THE TRADE ════════════════════════════════════════════ */}
      {/* Terrain slabs. The four kinds of ground Nepal throws at a tyre, as
          skewed photo slabs in the shape of Home's stat tiles.
          See TerrainSlabs. */}
      <TerrainSlabs />

      {/* ══ 3 · COMMITMENTS ══════════════════════════════════════════ */}
      {/* Zigzag on white, so the fold
          breaks cleanly from the carbon terrain slabs above it and no longer
          repeats their expanding-panel motion. Photo and text swap sides row
          by row; each photo carries a skewed number tile in the logo greens,
          the same shape as Home's stat slabs. The sidewall for genuine stock
          (the copy tells you to read it), the tractor for advice, the truck
          for the warranty. Below lg the rows stack photo-first. Copy unchanged. */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="reveal text-center font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink">
            What we <span className="text-brand">stand for</span>
          </h2>

          <ol className="mt-16 flex list-none flex-col gap-16 p-0 lg:gap-24">
            {commitments.map((c, i) => (
              <li key={c.head} className="reveal grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={`relative ${i % 2 ? 'lg:order-2' : ''}`}>
                  <img
                    src={c.img}
                    alt={c.alt}
                    loading="lazy"
                    className={`aspect-[4/3] w-full rounded-3xl object-cover ${c.pos}`}
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute -bottom-6 -skew-x-[9deg] rounded-[1.4rem_0.4rem_1.4rem_0.4rem] px-8 py-5 ${i % 2 ? 'left-4 lg:-left-6' : 'right-4 lg:-right-6'} ${commitmentTone[i]}`}
                  >
                    <span className="block skew-x-[9deg] font-display text-6xl font-black italic leading-none">0{i + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-wide text-[clamp(2rem,3.6vw,3.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink">
                    {c.head}
                  </h3>
                  <div aria-hidden="true" className="mt-6 h-1 w-16 bg-brand" />
                  <p className="mt-6 max-w-[46ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ 4 · THE GROUP ════════════════════════════════════════════ */}
      {/* The two marks as magnetic discs; hovering one tells its side. */}
      <GroupDiscs />

      {/* ══ 5 · CLOSING CTA ══════════════════════════════════════════ */}
      {/* Centred sign-off. One huge outlined line that is itself the link to
          Contact: on hover a solid brand-green copy wipes in over the
          outline from the left and an arrow slides in after it. Sized so the line never wraps, down to phone
          width. A rule, then a smaller link to the range. */}
      <section className="overflow-hidden bg-white py-20 sm:py-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-ash">Need the right tyre?</p>
          <div className="mt-6 flex flex-col items-center">
            <Link
              to="/contact"
              className="group flex items-center whitespace-nowrap font-wide text-[clamp(1.6rem,10vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand"
            >
              <span className="relative block">
                <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">Let's talk tyres</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block text-brand transition-[clip-path] duration-700 ease-[cubic-bezier(.16,1,.3,1)] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
                >
                  Let's talk tyres
                </span>
              </span>
              {/* The arrow's slot grows from nothing on hover, so the line
                  slides left to make room and stays centred as a whole. */}
              <span
                aria-hidden="true"
                className="hidden w-0 shrink-0 justify-end overflow-hidden text-brand transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-[1em] group-focus-visible:w-[1em] motion-reduce:transition-none sm:flex"
              >
                <Arrow className="h-[0.8em] w-[0.8em] shrink-0 -translate-x-[0.4em] opacity-0 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none" />
              </span>
            </Link>
          </div>

          <div className="mt-12 flex w-full flex-col items-center gap-4 border-t border-ink/15 pt-8">
            <span className="font-sans text-base text-ash sm:text-lg">Sizing, fitment or a fleet order — ask a person.</span>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-brand"
            >
              Or browse the range
              <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
