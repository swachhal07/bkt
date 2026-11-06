import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import tractorField from '../assets/tractor-field.webp'
import tyreDetail from '../assets/tyre-detail.webp'
import bktTruck from '../assets/bkt-truck.webp'

/* ────────────────────────────────────────────────────────────────────
   HERO LAB — temporary review page at /about-heroes (round 2, restored
   after round 3 was rejected in its favour). Six candidate About-page
   heroes, each built on a pattern that recurs on Awwwards and 21st.dev:
   an opening aperture, a fanned photo stack, a glowing horizon, kinetic
   marquee type, a cursor spotlight, a bento grid. Same copy in every
   option. ?v=N shows one option alone.

   Lab-only keyframes live in LAB_CSS below; whichever option is chosen
   moves into About.jsx and its keyframes into index.css, and this file
   and its route are deleted.
   ──────────────────────────────────────────────────────────────────── */

const LEDE =
  'We supply genuine BKT tyres across Nepal — for the farm, the site and the road — and we stand behind every one of them long after it leaves the shelf.'
const FACTS = [
  { label: 'Role', value: 'Authorised BKT distributor' },
  { label: 'Based', value: 'Kathmandu, Nepal' },
  { label: 'Hours', value: 'Sun–Fri · 09–18' },
  { label: 'Dispatch', value: 'Nationwide · 48h' },
]

const LAB_CSS = `
@keyframes lab-aperture { from { clip-path: inset(46% 0 46% 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes lab-zoom { from { transform: scale(1.18); } to { transform: scale(1); } }
@keyframes lab-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes lab-fan-l { from { transform: translate(-50%, 30%) rotate(0); } to { transform: translate(-128%, 8%) rotate(-12deg); } }
@keyframes lab-fan-r { from { transform: translate(-50%, 30%) rotate(0); } to { transform: translate(28%, 8%) rotate(12deg); } }
@keyframes lab-fan-c { from { transform: translate(-50%, 30%); } to { transform: translate(-50%, 0); } }
@keyframes lab-rise { from { transform: translate(-50%, 35%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
@keyframes lab-spin { to { transform: rotate(360deg); } }
@keyframes lab-glow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes lab-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.lab-up { animation: lab-up .9s cubic-bezier(.16,1,.3,1) both; }
.lab-outline { color: transparent; -webkit-text-stroke: 2px var(--color-ink); }
.lab-spot { -webkit-mask-image: radial-gradient(circle var(--r, 240px) at var(--x, 68%) var(--y, 45%), #000 55%, transparent 100%);
            mask-image: radial-gradient(circle var(--r, 240px) at var(--x, 68%) var(--y, 45%), #000 55%, transparent 100%); }
@media (prefers-reduced-motion: reduce) {
  .lab-up, .lab-anim { animation: none !important; }
}
`

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const TONES = {
  light: ['border-ink/20 bg-ink/[0.02] text-ink hover:text-white', 'bg-brand'],
  dark: ['border-white/35 bg-white/[0.08] text-white hover:text-carbon', 'bg-brand-glow'],
}
const Btn = ({ to, children, tone = 'light' }) => (
  <Link
    to={to}
    className={`group relative inline-flex items-center gap-3 overflow-hidden border px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${TONES[tone][0]}`}
  >
    <span aria-hidden="true" className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${TONES[tone][1]}`} />
    <span className="relative">{children}</span>
    <Arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
  </Link>
)
const Buttons = ({ tone, className = '' }) => (
  <div className={`flex flex-wrap gap-4 ${className}`}>
    <Btn to="/contact" tone={tone}>Talk to the desk</Btn>
    <Btn to="/products" tone={tone}>See the range</Btn>
  </div>
)

const Kicker = ({ children = 'About BKT Tyres', className = 'text-brand', dot = 'bg-brand' }) => (
  <div className={`flex items-center gap-3 font-sans text-sm font-bold uppercase tracking-[0.25em] ${className}`}>
    <span className={`h-2 w-2 ${dot}`} aria-hidden="true" />
    {children}
  </div>
)

const Facts = ({ dark, className = '' }) => (
  <dl className={`grid grid-cols-2 lg:grid-cols-4 ${className}`}>
    {FACTS.map((f) => (
      <div key={f.label} className={`py-5 pr-4 ${dark ? 'lg:border-white/15' : 'lg:border-ink/10'} lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0`}>
        <dt className={`font-mono text-[10px] uppercase tracking-[0.28em] ${dark ? 'text-white/55' : 'text-ash'}`}>{f.label}</dt>
        <dd className={`mt-2 font-mono text-xs font-medium uppercase tracking-[0.08em] sm:text-[13px] ${dark ? 'text-white' : 'text-ink'}`}>{f.value}</dd>
      </div>
    ))}
  </dl>
)

const Wrap = ({ className = '', style, children }) => (
  <div className={`mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-10 ${className}`} style={style}>{children}</div>
)

const Label = ({ n, name, note }) => (
  <div className="border-y border-ink bg-ink text-white">
    <Wrap className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
      <span className="font-mono text-xs uppercase tracking-[0.28em] text-brand-glow">Option {String(n).padStart(2, '0')}</span>
      <span className="font-wide text-lg font-extrabold uppercase tracking-tight">{name}</span>
      <span className="font-sans text-sm text-white/60">{note}</span>
    </Wrap>
  </div>
)

const HERO_H = 'min-h-[calc(100svh-6rem)]'
const delay = (ms) => ({ animationDelay: `${ms}ms` })

/* ── 01 · Aperture ─────────────────────────────────────────────────────
   Headline split in two. On load a letterbox slit between the halves
   opens into a wide cinematic window onto the field, while the photo
   inside settles from a slow zoom. */
const V1 = () => (
  <section className={`flex ${HERO_H} flex-col overflow-hidden bg-carbon text-white`}>
    <Wrap className="flex flex-1 flex-col justify-center gap-5 py-10">
      <div className="lab-up flex items-end justify-between gap-6">
        <h1 className="font-wide text-[clamp(2.2rem,7vw,9rem)] font-extrabold uppercase leading-[0.86] tracking-tight">
          The people behind <span className="sr-only">the tyres you run.</span>
        </h1>
        <span className="hidden shrink-0 pb-3 xl:block"><Kicker className="text-brand-glow" dot="bg-brand-glow" /></span>
      </div>
      <div className="lab-anim relative h-[clamp(12rem,34vh,26rem)] overflow-hidden" style={{ animation: 'lab-aperture 1.5s cubic-bezier(.77,0,.18,1) .25s both' }}>
        <img src={tractorField} alt="John Deere tractor on BKT Flotation 648 tyres in a flowering meadow" className="lab-anim h-full w-full object-cover object-[50%_58%]" style={{ animation: 'lab-zoom 2.4s cubic-bezier(.16,1,.3,1) .25s both' }} />
        <span className="absolute bottom-4 left-4 bg-brand px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white">BKT Flotation 648 · in the field</span>
      </div>
      <p aria-hidden="true" className="lab-up text-right font-wide text-[clamp(2.2rem,7vw,9rem)] font-extrabold uppercase leading-[0.86] tracking-tight text-brand-glow" style={delay(150)}>
        the tyres you run.
      </p>
      <div className="lab-up mt-4 grid items-end gap-6 border-t border-white/15 pt-6 lg:grid-cols-12" style={delay(700)}>
        <p className="max-w-[56ch] text-base leading-relaxed text-white/70 lg:col-span-7">{LEDE}</p>
        <Buttons tone="dark" className="lg:col-span-5 lg:justify-end" />
      </div>
    </Wrap>
  </section>
)

/* ── 02 · Photo fan ────────────────────────────────────────────────────
   Centred type over three mounted prints that deal out from a stack on
   load and lift when hovered — the 21st.dev "image fan" hero. */
const FAN = [
  { src: tractorField, cap: 'The farm', anim: 'lab-fan-l', hover: 'group-hover:-translate-x-6 group-hover:-rotate-3', pos: 'object-[60%_60%]' },
  { src: bktTruck, cap: 'The road', anim: 'lab-fan-r', hover: 'group-hover:translate-x-6 group-hover:rotate-3', pos: 'object-center' },
  { src: tyreDetail, cap: 'The sidewall', anim: 'lab-fan-c', hover: 'group-hover:-translate-y-5', pos: 'object-[55%_60%]' },
]
const V2 = () => (
  <section className={`relative flex ${HERO_H} flex-col overflow-hidden bg-white`}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_70%_at_50%_100%,var(--color-mist),transparent)]" />
    <Wrap className="relative flex flex-col items-center pt-12 text-center sm:pt-14">
      <div className="lab-up"><Kicker /></div>
      <h1 className="lab-up mt-6 font-wide text-[clamp(2.2rem,5.6vw,6.5rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink" style={delay(80)}>
        The people behind<br /><span className="text-brand">the tyres you run.</span>
      </h1>
      <p className="lab-up mt-6 max-w-[54ch] text-base leading-relaxed text-ash sm:text-lg" style={delay(160)}>{LEDE}</p>
      <div className="lab-up mt-8" style={delay(240)}><Buttons className="justify-center" /></div>
    </Wrap>
    <div className="group relative mt-10 min-h-[19rem] flex-1">
      {FAN.map((c, i) => (
        <figure
          key={c.cap}
          className="lab-anim absolute left-1/2 top-0 w-[clamp(10rem,22vw,20rem)]"
          style={{ animation: `${c.anim} 1.2s cubic-bezier(.16,1,.3,1) ${400 + i * 90}ms both`, zIndex: i === 2 ? 3 : 1 }}
        >
          <div className={`bg-white p-2 shadow-[0_30px_60px_-25px_rgba(12,13,15,0.45)] transition-transform duration-700 ease-out ${c.hover}`}>
            <img src={c.src} alt="" className={`aspect-[4/5] w-full object-cover ${c.pos}`} />
            <figcaption className="px-1 pb-1 pt-2 text-left font-mono text-[10px] uppercase tracking-[0.24em] text-ash">{c.cap}</figcaption>
          </div>
        </figure>
      ))}
    </div>
  </section>
)

/* ── 03 · Rising tyre ──────────────────────────────────────────────────
   A tyre-sized disc of the sidewall photograph rises over the bottom
   edge like a planet over a horizon, rim lit in brand green, slowly
   turning. The "glowing horizon" hero, made literal for a tyre company. */
const V3 = () => (
  <section className={`relative flex ${HERO_H} flex-col overflow-hidden bg-carbon text-white`}>
    <Wrap className="relative z-10 flex flex-col items-center pt-12 text-center sm:pt-16">
      <div className="lab-up"><Kicker className="text-brand-glow" dot="bg-brand-glow" /></div>
      <h1 className="lab-up mt-6 font-wide text-[clamp(2.2rem,6vw,7rem)] font-extrabold uppercase leading-[0.88] tracking-tight" style={delay(80)}>
        The people behind<br /><span className="text-brand-glow">the tyres you run.</span>
      </h1>
      <p className="lab-up mt-6 max-w-[54ch] text-base leading-relaxed text-white/65 sm:text-lg" style={delay(160)}>{LEDE}</p>
      <div className="lab-up mt-8" style={delay(240)}><Buttons tone="dark" className="justify-center" /></div>
    </Wrap>
    <div className="relative min-h-[14rem] flex-1">
      <div
        className="lab-anim absolute left-1/2 top-[14%] aspect-square w-[min(68rem,150vw)]"
        style={{ animation: 'lab-rise 1.6s cubic-bezier(.16,1,.3,1) .3s both' }}
      >
        <div aria-hidden="true" className="lab-anim absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(140,198,63,0.35),transparent)]" style={{ animation: 'lab-glow 5s ease-in-out infinite' }} />
        <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-brand-glow shadow-[0_0_90px_rgba(140,198,63,0.55),inset_0_0_80px_rgba(0,0,0,0.6)]">
          <img src={tyreDetail} alt="" className="lab-anim h-full w-full object-cover" style={{ animation: 'lab-spin 140s linear infinite' }} />
          <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent_70%,rgba(12,13,15,0.6))]" />
        </div>
        <div aria-hidden="true" className="lab-anim absolute inset-[4%] rounded-full border border-dashed border-white/25" style={{ animation: 'lab-spin 90s linear infinite reverse' }} />
      </div>
    </div>
  </section>
)

/* ── 04 · Kinetic type ─────────────────────────────────────────────────
   The headline runs as two opposing marquee bands — outline above, solid
   brand green below — with a tilted print of the sidewall and a spinning
   "Genuine BKT" seal pinned across them. */
const Band = ({ text, reverse, className }) => (
  <div className="overflow-hidden whitespace-nowrap" aria-hidden="true">
    <div className="lab-anim flex w-max" style={{ animation: `lab-scroll 38s linear infinite${reverse ? ' reverse' : ''}` }}>
      {[0, 1].map((k) => (
        <span key={k} className={`pr-[0.4em] font-wide text-[clamp(3.5rem,11vw,12rem)] font-extrabold uppercase leading-[0.95] tracking-tight ${className}`}>
          {text} ✦ {text} ✦{' '}
        </span>
      ))}
    </div>
  </div>
)
const SEAL = 'Genuine BKT · Authorised distributor · Nepal · '
const Seal = ({ className = '', id = 'seal' }) => (
  <div className={`aspect-square ${className}`}>
    <svg viewBox="0 0 200 200" className="lab-anim absolute inset-0 h-full w-full" style={{ animation: 'lab-spin 22s linear infinite' }} aria-hidden="true">
      <defs><path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
      <circle cx="100" cy="100" r="98" className="fill-brand" />
      <text className="fill-white font-mono" style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        <textPath href={`#${id}`} textLength="462" lengthAdjust="spacing">{SEAL}</textPath>
      </text>
    </svg>
    <Arrow className="absolute inset-[36%] -rotate-45 text-white" />
  </div>
)
const V4 = () => (
  <section className={`relative flex ${HERO_H} flex-col justify-center overflow-hidden bg-white`}>
    <h1 className="sr-only">The people behind the tyres you run.</h1>
    <Wrap className="lab-up pt-8"><Kicker /></Wrap>
    <div className="relative mt-6">
      <Band text="The people behind" className="lab-outline" />
      <Band text="The tyres you run" reverse className="text-brand" />
      <figure className="pointer-events-none absolute left-1/2 top-1/2 w-[clamp(10rem,20vw,18rem)] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] bg-white p-2 shadow-[0_40px_80px_-30px_rgba(12,13,15,0.55)]">
        <img src={tyreDetail} alt="" className="aspect-[4/5] w-full object-cover object-[55%_60%]" />
      </figure>
      <Seal id="seal-v4" className="absolute right-[7%] top-[-18%] z-10 hidden w-28 sm:block lg:w-36" />
    </div>
    <Wrap className="lab-up mt-10 grid items-end gap-6 pb-10 lg:grid-cols-12" style={delay(300)}>
      <p className="max-w-[54ch] text-base leading-relaxed text-ash sm:text-lg lg:col-span-7">{LEDE}</p>
      <Buttons className="lg:col-span-5 lg:justify-end" />
    </Wrap>
  </section>
)

/* ── 05 · Spotlight ────────────────────────────────────────────────────
   The field photograph sits dim and monochrome; a soft lamp follows the
   cursor and shows it in full colour underneath. Without a pointer the
   lamp rests on the tractor. */
const V5 = () => {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <section ref={ref} onPointerMove={move} className={`relative isolate flex ${HERO_H} flex-col justify-end overflow-hidden bg-carbon text-white`} style={{ '--r': 'clamp(160px, 22vw, 320px)' }}>
      <img src={tractorField} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_55%] opacity-35 grayscale" />
      <img src={tractorField} alt="" className="lab-spot absolute inset-0 -z-10 h-full w-full object-cover object-[60%_55%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
      <Wrap className="pb-8 pt-28">
        <div className="lab-up flex items-center justify-between gap-6">
          <Kicker className="text-brand-glow" dot="bg-brand-glow" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-white/50 sm:block">Move your cursor — look closer</span>
        </div>
        <h1 className="lab-up mt-6 font-wide text-[clamp(2.4rem,7.2vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-tight" style={delay(80)}>
          The people behind<br /><span className="text-brand-glow">the tyres you run.</span>
        </h1>
        <div className="lab-up mt-8 grid items-end gap-6 lg:grid-cols-12" style={delay(200)}>
          <p className="max-w-[54ch] text-base leading-relaxed text-white/70 sm:text-lg lg:col-span-7">{LEDE}</p>
          <Buttons tone="dark" className="lg:col-span-5 lg:justify-end" />
        </div>
        <Facts dark className="lab-up mt-10 border-t border-white/15" />
      </Wrap>
    </section>
  )
}

/* ── 06 · Bento ────────────────────────────────────────────────────────
   The hero as a tiled board: headline tile, two photo tiles, a green
   dispatch tile, the spinning seal pinned on the sidewall — the bento
   grid that dominates current studio and SaaS heroes, in BKT's palette. */
const Tile = ({ className = '', style, children }) => (
  <div className={`lab-up relative overflow-hidden rounded-2xl ${className}`} style={style}>{children}</div>
)
const V6 = () => (
  <section className={`flex ${HERO_H} flex-col bg-fog`}>
    <Wrap className="grid flex-1 gap-3 py-4 sm:py-6 lg:grid-cols-12 lg:grid-rows-[1.25fr_1fr]">
      <Tile className="flex flex-col justify-between bg-white p-7 sm:p-10 lg:col-span-7 lg:row-span-2">
        <Kicker />
        <div>
          <h1 className="mt-10 font-wide text-[clamp(2.2rem,min(5.2vw,11vh),6.75rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink">
            The people<br />behind the<br /><span className="text-brand">tyres you run.</span>
          </h1>
          <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-ash sm:text-lg">{LEDE}</p>
          <Buttons className="mt-8" />
        </div>
      </Tile>
      <Tile className="group min-h-[14rem] bg-carbon lg:col-span-5" style={delay(100)}>
        <img src={tractorField} alt="" className="absolute inset-0 h-full w-full object-cover object-[60%_60%] transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">For the farm</span>
      </Tile>
      <Tile className="flex min-h-[11rem] flex-col justify-between bg-brand p-6 text-white lg:col-span-2" style={delay(180)}>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">Dispatch</span>
        <div>
          <div className="font-wide text-5xl font-extrabold leading-none">48h</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">Nationwide</div>
        </div>
      </Tile>
      <Tile className="group min-h-[11rem] bg-carbon lg:col-span-3" style={delay(240)}>
        <img src={tyreDetail} alt="" className="absolute inset-0 h-full w-full object-cover object-[55%_62%] transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
        <Seal id="seal-v6" className="absolute bottom-4 right-4 w-24 xl:w-28" />
      </Tile>
    </Wrap>
    <Wrap className="pb-4">
      <Facts className="rounded-2xl bg-white px-6 lg:px-8" />
    </Wrap>
  </section>
)

const OPTIONS = [
  { C: V1, name: 'Aperture', note: 'Headline splits open into a cinematic window on load.' },
  { C: V2, name: 'Photo fan', note: 'Three prints deal out from a stack, lift on hover.' },
  { C: V3, name: 'Rising tyre', note: 'A glowing, turning tyre rises over the horizon.' },
  { C: V4, name: 'Kinetic type', note: 'Headline runs as moving bands, print and seal pinned on top.' },
  { C: V5, name: 'Spotlight', note: 'Dim photo — your cursor lamp reveals it in colour.' },
  { C: V6, name: 'Bento', note: 'Tiled board — headline, photos, dispatch, seal.' },
]

export default function HeroLab() {
  /* ?v=3 shows only option 3 — handy for comparing one at a time. */
  const [params] = useSearchParams()
  const only = Number(params.get('v')) || 0
  const chip = (on) =>
    `border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] ${on ? 'border-brand text-brand' : 'border-ink/15 text-ink hover:border-brand hover:text-brand'}`
  return (
    <>
      <style>{LAB_CSS}</style>
      <Wrap className="flex flex-wrap items-center gap-x-4 gap-y-3 py-6">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-ash">About hero · round 2 — pick one</span>
        <a href="?" className={chip(!only)}>All</a>
        {OPTIONS.map((o, i) => (
          <a key={o.name} href={`?v=${i + 1}`} className={chip(only === i + 1)}>
            {String(i + 1).padStart(2, '0')} · {o.name}
          </a>
        ))}
      </Wrap>
      {OPTIONS.map(({ C, name, note }, i) =>
        only && only !== i + 1 ? null : (
          <div key={name}>
            <Label n={i + 1} name={name} note={note} />
            <C />
          </div>
        ),
      )}
    </>
  )
}
