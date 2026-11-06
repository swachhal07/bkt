import { useState } from 'react'

import bktSidewall from '../assets/bkt-tyre-sidewall.jpg'

/* ────────────────────────────────────────────────────────────────────
   SPOT LAB — four ways for Home's "Spot a fake" photo to point out the
   active marking, at /spot-lab. The chosen one moves into Home.jsx and
   this file is deleted. Rejected so far: a thin ring on a pin, and green
   corner brackets with the rest of the photo dimmed.

     1  ZOOM ONLY   the photo zooms onto the marking, nothing drawn on it
     2  SPOTLIGHT   zoom + a soft dark fade around the marking
     3  CALLOUT     photo stays still; a dot, a line and a label tag
     4  MAGNIFIER   photo stays still; a round lens enlarges the marking
   ──────────────────────────────────────────────────────────────────── */

// Same data as Home: box = [x, y, w, h] in % of the 4:3 frame.
const checks = [
  {
    title: 'A crisp BKT mark',
    desc: 'Sharp, even lettering with clean edges. Blurred, uneven or peeling branding is a warning sign.',
    box: [35, 17.5, 21, 16.5],
    zoom: 2.2,
    side: 'below',
    lens: 1.8,
  },
  {
    title: 'Moulded into the rubber',
    desc: 'Moulded into the tyre itself, not just printed on. Raised letters should be deep and crisp.',
    box: [21.5, 52.5, 14, 25],
    zoom: 2,
    origin: [28.5, 90],
    side: 'above',
    lens: 1.9,
  },
  {
    title: 'Size and date code',
    desc: 'Check the size and the week/year date code. Very old stock, or a code ground off, means walk away.',
    box: [70.5, 26.5, 11, 32],
    zoom: 1.9,
    side: 'below',
    lens: 1.6,
  },
]

const pad = (i) => String(i + 1).padStart(2, '0')
const center = ({ box: [x, y, w, h] }) => [x + w / 2, y + h / 2]
const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'
const move = { transition: `all 0.9s ${ease}` }

const Photo = ({ style }) => (
  <img src={bktSidewall} alt="" className="h-full w-full object-cover" style={style} />
)

/* Big number + title over the bottom of the photo, as on Home. */
const Caption = ({ i }) => (
  <>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-carbon/90 to-transparent" />
    <p className="pointer-events-none absolute bottom-8 left-8 right-8 flex items-end gap-4 text-white">
      <span className="font-display text-6xl font-black italic leading-[0.8] text-brand-glow">{pad(i)}</span>
      <span className="font-display text-3xl font-bold uppercase leading-none">{checks[i].title}</span>
    </p>
  </>
)

/* Zoomed photo layer shared by 1 and 2. */
const Zoomed = ({ c }) => {
  const [ox, oy] = c.origin ?? center(c)
  return (
    <div className="absolute inset-0" style={{ transform: `scale(${c.zoom})`, transformOrigin: `${ox}% ${oy}%`, transition: `transform 0.9s ${ease}, transform-origin 0.9s ${ease}` }}>
      <Photo />
    </div>
  )
}

/* Where the marking ends up once zoomed (see Home's SpotFake). */
const zoomedBox = (c) => {
  const [ox, oy] = c.origin ?? center(c)
  const [x, y, w, h] = c.box
  return [ox + (x - ox) * c.zoom, oy + (y - oy) * c.zoom, w * c.zoom, h * c.zoom]
}

/* ── 1 · ZOOM ONLY ────────────────────────────────────────────────── */
const ZoomOnly = ({ i }) => (
  <>
    <Zoomed c={checks[i]} />
    <Caption i={i} />
  </>
)

/* ── 2 · SPOTLIGHT ────────────────────────────────────────────────── */
/* A layer three times the marking's size, clear in the middle and fading
   to dark at its edge; a solid shadow continues the dark beyond it. */
const Spotlight = ({ i }) => {
  const [x, y, w, h] = zoomedBox(checks[i])
  return (
    <>
      <Zoomed c={checks[i]} />
      <div
        className="pointer-events-none absolute"
        style={{
          ...move,
          left: `${x - w}%`,
          top: `${y - h}%`,
          width: `${w * 3}%`,
          height: `${h * 3}%`,
          background: 'radial-gradient(closest-side, transparent 38%, rgb(14 15 17 / 0.72) 100%)',
          boxShadow: '0 0 0 200vmax rgb(14 15 17 / 0.72)',
        }}
      />
      <Caption i={i} />
    </>
  )
}

/* ── 3 · CALLOUT ──────────────────────────────────────────────────── */
const Callout = ({ i }) => {
  const c = checks[i]
  const [cx] = center(c)
  const [, y, , h] = c.box
  const below = c.side === 'below'
  const len = 9 // % of the photo's height
  const lineTop = below ? y + h : y - len
  const labelY = below ? y + h + len : y - len
  return (
    <>
      <Photo />
      <div className="pointer-events-none absolute inset-0 bg-carbon/25" />
      {/* outline the marking, then drop a line to the label */}
      <div className="pointer-events-none absolute rounded-md border-2 border-white" style={{ ...move, left: `${c.box[0]}%`, top: `${c.box[1]}%`, width: `${c.box[2]}%`, height: `${c.box[3]}%` }} />
      <div className="pointer-events-none absolute w-0.5 bg-white" style={{ ...move, left: `${cx}%`, top: `${lineTop}%`, height: `${len}%` }} />
      <div
        className={`pointer-events-none absolute flex -translate-x-1/2 items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 shadow-[0_4px_14px_rgb(0_0_0/0.25)] ${below ? '' : '-translate-y-full'}`}
        style={{ ...move, left: `${cx}%`, top: `${labelY}%` }}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand font-display text-base font-bold text-white">{i + 1}</span>
        <span className="whitespace-nowrap font-display text-lg font-bold uppercase text-ink">{c.title}</span>
      </div>
    </>
  )
}

/* ── 4 · MAGNIFIER ────────────────────────────────────────────────── */
/* The lens is 44% of the photo's width, kept inside the photo. Inside it
   sits a copy of the photo `lens` times larger, shifted so the marking
   lands mid-lens. */
const LENS = 44
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const Magnifier = ({ i }) => {
  const c = checks[i]
  const Z = c.lens
  const [cx, cy] = center(c)
  const lensH = LENS / 0.75 // lens height in % of the photo's height (4:3)
  // the enlarged copy's size in % of the lens: photo size × Z ÷ lens size
  const innerW = (Z * 100 * 100) / LENS
  const innerH = (Z * 100 * 100) / lensH
  const left = clamp(cx - LENS / 2, 3, 97 - LENS)
  const top = clamp(cy - lensH / 2, 3, 97 - lensH)
  return (
    <>
      <Photo />
      <div className="pointer-events-none absolute inset-0 bg-carbon/30" />
      <div
        className="pointer-events-none absolute aspect-square overflow-hidden rounded-full border-4 border-white shadow-[0_10px_30px_rgb(0_0_0/0.45)]"
        style={{ ...move, width: `${LENS}%`, left: `${left}%`, top: `${top}%` }}
      >
        <div
          className="absolute"
          style={{
            ...move,
            width: `${innerW}%`,
            height: `${innerH}%`,
            left: `${50 - (cx / 100) * innerW}%`,
            top: `${50 - (cy / 100) * innerH}%`,
          }}
        >
          <Photo />
        </div>
      </div>
    </>
  )
}

/* One option: the photo with its highlight beside Home's check list. */
function Option({ Highlight }) {
  const [active, setActive] = useState(0)
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-carbon">
          <Highlight i={active} />
        </div>
        <ol className="border-b border-ink/10">
          {checks.map((c, i) => {
            const on = active === i
            return (
              <li key={c.title} className="relative border-t border-ink/10">
                <span aria-hidden="true" className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-brand transition-transform duration-500 ${on ? 'scale-y-100' : 'scale-y-0'}`} />
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-start gap-5 py-6 pl-6 pr-4 text-left transition-colors duration-300 ${on ? 'bg-brand/[0.04]' : 'hover:bg-fog'}`}
                >
                  <span className={`font-display text-4xl font-black leading-none ${on ? 'text-brand' : 'text-ink/20'}`}>{pad(i)}</span>
                  <span>
                    <span className={`block pt-1 font-display text-2xl font-bold uppercase leading-tight ${on ? 'text-brand' : 'text-ink'}`}>{c.title}</span>
                    <span className="mt-2 block font-sans text-base leading-relaxed text-ash">{c.desc}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

const options = [
  { id: 1, name: 'Zoom only', note: 'The photo zooms onto the marking. Nothing drawn on top.', C: ZoomOnly },
  { id: 2, name: 'Soft spotlight', note: 'Zooms in, and the photo fades darker around the marking with a soft edge.', C: Spotlight },
  { id: 3, name: 'Callout label', note: 'The photo stays still. The marking is outlined, with a line out to a label tag.', C: Callout },
  { id: 4, name: 'Magnifier lens', note: 'The photo stays still. A round lens over the marking shows it enlarged.', C: Magnifier },
]

export default function SpotLab() {
  return (
    <div className="bg-fog pt-24">
      <header className="mx-auto max-w-[100rem] px-4 pb-10 pt-12 sm:px-6 lg:px-10">
        <h1 className="font-wide text-[clamp(2rem,4vw,3.5rem)] font-extrabold uppercase leading-none tracking-tight text-ink">
          Spot a fake — highlight options
        </h1>
        <p className="mt-4 max-w-[70ch] font-sans text-base text-ash">
          Four ways for the photo to point out each marking. Hover or click the checks beside each photo to see it move.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2">
          {options.map((o) => (
            <a key={o.id} href={`#opt-${o.id}`} className="rounded-full border border-ink/15 bg-white px-4 py-2 font-sans text-sm font-semibold text-ink hover:border-brand hover:text-brand">
              {o.id} · {o.name}
            </a>
          ))}
        </nav>
      </header>
      {options.map(({ id, name, note, C }) => (
        <div key={id} id={`opt-${id}`} className="scroll-mt-24">
          <div className="mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-10">
            <p className="font-wide text-2xl font-extrabold uppercase text-ink">
              <span className="text-brand">{id}</span> · {name}
            </p>
            <p className="mt-1 font-sans text-sm text-ash">{note}</p>
          </div>
          <Option Highlight={C} />
        </div>
      ))}
      <div className="h-24" />
    </div>
  )
}
