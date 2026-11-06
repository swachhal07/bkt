import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import bktLogo from '../assets/logo-solid.png'
import mvLogo from '../assets/dugar-logo-hd.png' // 1899px, from mvdugar.com/dugar.svg

/* ────────────────────────────────────────────────────────────────────
   GROUP LAB · round 5 — four candidates for About's MV Dugar fold, at
   /group-lab. The chosen one moves into About.jsx and this file is deleted.

   Brief (2026-10-17): drop the timeline and the facts — just BKT and
   MV Dugar, with a good design and good animation. A high-res MV mark is
   now available, so the seal can finally be shown large.

     1  ROLL     the MV seal rolls in like a wheel as you scroll and
                 comes to rest as a badge on the BKT plate
     2  TILT     both marks floating at different depths; the pair tilts
                 with the cursor
     3  REVEAL   pinned: the seal shrinks to the top, a green circle
                 grows out of it, and BKT rises in the middle
     4  SLABS    Home's skewed slabs, one per mark, sliding in from
                 opposite sides and locking together
   ──────────────────────────────────────────────────────────────────── */

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const WipeLink = ({ to, children, tone = 'dark' }) => {
  const onDark = tone === 'dark'
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center gap-3 overflow-hidden border px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
        onDark ? 'border-white/35 bg-white/[0.08] text-white hover:text-carbon' : 'border-ink/20 bg-ink/[0.02] text-ink hover:text-white'
      }`}
    >
      <span aria-hidden="true" className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none ${onDark ? 'bg-brand-glow' : 'bg-brand'}`} />
      <span className="relative">{children}</span>
      <Arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  )
}

const line = 'BKT Tyres is brought to Nepal by the MV Dugar Group — a Nepali business house since 1884.'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* 0 → 1 as `ref` travels from `start` to `end` (fractions of viewport
   height, measured at the element's top). Reduced motion pins it to 1. */
function useScrollProgress(ref, start = 1, end = 0.3) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (reduced()) {
      setP(1)
      return
    }
    let raf
    const update = () => {
      raf = null
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      setP(Math.min(1, Math.max(0, (start * vh - top) / ((start - end) * vh))))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, start, end])
  return p
}

/* Progress through a tall pinned wrapper: 0 when it reaches the top, 1
   when its end leaves. */
function usePinProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (reduced()) {
      setP(1)
      return
    }
    let raf
    const update = () => {
      raf = null
      const el = ref.current
      if (!el) return
      /* The sticky child sits under the 6rem navbar, so pinning runs from
         top = 96 until the wrapper's bottom meets the viewport's. */
      const r = el.getBoundingClientRect()
      const span = r.height - (window.innerHeight - 96)
      setP(Math.min(1, Math.max(0, (96 - r.top) / span)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref])
  return p
}

function useInView(ref, threshold = 0.3) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window) || reduced()) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return seen
}

const ease = (t) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t) => Math.min(1, Math.max(0, t))
const range = (p, a, b) => clamp01((p - a) / (b - a))

/* ── 1 · Roll ─────────────────────────────────────────────────────── */

const Roll = () => {
  const stage = useRef(null)
  const p = ease(useScrollProgress(stage, 1, 0.35))
  const seal = 'clamp(9rem,18vw,15rem)'

  return (
    <section className="overflow-hidden bg-white py-24 text-ink sm:py-32">
      <div className="mx-auto grid max-w-[100rem] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-10">
        <div>
          <h2 className="font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Part of the
            <br />
            <span className="text-brand">MV Dugar Group.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{line}</p>
          <div className="mt-10">
            <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
          </div>
        </div>

        <div ref={stage} className="relative pl-[calc(clamp(9rem,18vw,15rem)*0.45)] pt-[calc(clamp(9rem,18vw,15rem)*0.45)]">
          <div className="flex aspect-[16/10] items-center justify-center rounded-3xl bg-fog p-[10%]">
            <img
              src={bktLogo}
              alt="BKT — Growing Together"
              className="w-full max-w-[30rem]"
              style={{ opacity: 0.25 + 0.75 * range(p, 0.4, 1), transform: `translateY(${(1 - range(p, 0.3, 1)) * 24}px)` }}
            />
          </div>
          {/* The seal rolls in from the right edge across the plate and turns
              as it travels, so it reads as rolling rather than sliding. */}
          <img
            src={mvLogo}
            alt="MV Dugar Group"
            className="absolute left-0 top-0 rounded-full shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)]"
            style={{
              width: seal,
              height: seal,
              transform: `translateX(${(1 - p) * 70}vw) rotate(${(1 - p) * 720}deg)`,
            }}
          />
        </div>
      </div>
    </section>
  )
}

/* ── 2 · Tilt ─────────────────────────────────────────────────────── */

const Tilt = () => {
  const stage = useRef(null)
  const rig = useRef(null)
  const seen = useInView(stage, 0.35)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return
    const cur = { x: 0, y: 0 }
    let raf
    const tick = () => {
      cur.x += (target.current.x - cur.x) * 0.08
      cur.y += (target.current.y - cur.y) * 0.08
      if (rig.current) rig.current.style.transform = `rotateX(${cur.y * -10}deg) rotateY(${cur.x * 14}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMove = (e) => {
    const r = stage.current.getBoundingClientRect()
    target.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }
  }

  const fly = (delay, z) => ({
    transform: seen ? `translateZ(${z}px)` : `translateZ(${z - 260}px) translateY(40px)`,
    opacity: seen ? 1 : 0,
    transition: `transform 1100ms cubic-bezier(.16,1,.3,1) ${delay}ms, opacity 700ms ease ${delay}ms`,
  })

  return (
    <section
      ref={stage}
      onPointerMove={onMove}
      onPointerLeave={() => (target.current = { x: 0, y: 0 })}
      className="overflow-hidden bg-carbon py-24 text-white sm:py-32"
    >
      <div className="mx-auto max-w-[100rem] px-4 text-center sm:px-6 lg:px-10">
        <h2 className="font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          Part of the <span className="text-brand">MV Dugar Group.</span>
        </h2>

        <div className="mx-auto mt-16 max-w-5xl [perspective:1400px]">
          <div ref={rig} className="relative [transform-style:preserve-3d]">
            {/* Back plate */}
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-steel" style={fly(0, 0)} />
            <div className="relative grid grid-cols-1 items-center gap-10 p-10 sm:grid-cols-[auto_1fr] sm:gap-14 sm:p-16 [transform-style:preserve-3d]">
              <img
                src={mvLogo}
                alt="MV Dugar Group"
                className="mx-auto h-40 w-40 rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:h-56 sm:w-56"
                style={fly(150, 70)}
              />
              <div className="rounded-3xl bg-white p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:p-12" style={fly(300, 120)}>
                <img src={bktLogo} alt="BKT — Growing Together" className="mx-auto w-full max-w-[26rem]" />
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-[52ch] font-sans text-base leading-relaxed text-white/70 sm:text-lg">{line}</p>
        <div className="mt-10">
          <WipeLink to="/leadership">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 3 · Reveal (pinned) ──────────────────────────────────────────── */

const Reveal = () => {
  const wrap = useRef(null)
  const p = usePinProgress(wrap)

  const a = ease(range(p, 0.05, 0.45)) // seal shrinks and docks
  const b = ease(range(p, 0.2, 0.6)) // green circle grows
  const c = ease(range(p, 0.5, 0.85)) // BKT + copy rise

  return (
    <section ref={wrap} className="relative bg-carbon text-white" style={{ height: '260vh' }}>
      <div className="sticky top-24 h-[calc(100svh-6rem)] overflow-hidden">
        {/* Green field grows out of the seal's centre */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brand"
          style={{ clipPath: `circle(${b * 125}% at 50% ${50 - a * 28}%)` }}
        />

        {/* Seal: big and centred, then small and docked at the top */}
        <img
          src={mvLogo}
          alt="MV Dugar Group"
          className="absolute left-1/2 top-1/2 h-[min(52vh,26rem)] w-[min(52vh,26rem)] rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
          style={{ transform: `translate(-50%, calc(-50% - ${a * 28}vh)) scale(${1 - a * 0.62}) rotate(${a * -360}deg)` }}
        />

        {/* BKT and the line */}
        <div
          className="absolute inset-x-0 top-1/2 flex flex-col items-center px-4 text-center"
          style={{ opacity: c, transform: `translateY(calc(-30% + ${(1 - c) * 60}px))` }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/80">The group behind</p>
          <div className="mt-5 rounded-3xl bg-white px-8 py-7 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:px-12 sm:py-9">
            <img src={bktLogo} alt="BKT — Growing Together" className="w-[min(70vw,24rem)]" />
          </div>
          <p className="mt-8 max-w-[48ch] font-sans text-base leading-relaxed text-white/90 sm:text-lg">{line}</p>
          <div className="mt-8" style={{ pointerEvents: c > 0.9 ? 'auto' : 'none' }}>
            <WipeLink to="/leadership">Meet the leadership</WipeLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 4 · Slabs ────────────────────────────────────────────────────── */

const Slabs = () => {
  const ref = useRef(null)
  const seen = useInView(ref, 0.35)
  const slide = (from, delay) => ({
    transform: seen ? 'translateX(0)' : `translateX(${from})`,
    opacity: seen ? 1 : 0,
    transition: `transform 1000ms cubic-bezier(.16,1,.3,1) ${delay}ms, opacity 600ms ease ${delay}ms`,
  })

  return (
    <section ref={ref} className="overflow-hidden bg-fog py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          Part of the <span className="text-brand">MV Dugar Group.</span>
        </h2>

        <div className="mt-16 grid gap-4 md:grid-cols-2 md:gap-5 md:px-6">
          <div style={slide('-40vw', 0)}>
            <div className="group -skew-x-[9deg] rounded-[1.6rem_0.4rem_1.6rem_0.4rem] bg-carbon px-8 py-12 transition-transform duration-500 hover:-translate-y-2 sm:py-16">
              <div className="flex skew-x-[9deg] flex-col items-center text-center text-white">
                <img src={mvLogo} alt="MV Dugar Group" className="h-36 w-36 rounded-full transition-transform duration-700 group-hover:rotate-[-20deg] sm:h-44 sm:w-44" />
                <p className="mt-8 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60 sm:text-xs">The group · since 1884</p>
              </div>
            </div>
          </div>
          <div style={slide('40vw', 120)}>
            <div className="group -skew-x-[9deg] rounded-[1.6rem_0.4rem_1.6rem_0.4rem] bg-white px-8 py-12 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:-translate-y-2 sm:py-16">
              <div className="flex h-full skew-x-[9deg] flex-col items-center justify-center text-center">
                <div className="flex h-36 items-center sm:h-44">
                  <img src={bktLogo} alt="BKT — Growing Together" className="w-[min(70vw,20rem)] transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-8 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-ash sm:text-xs">The brand · since 2021</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-8 text-center" style={slide('0', 300)}>
          <p className="max-w-[52ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{line}</p>
          <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 5 · Tread trail ──────────────────────────────────────────────── */

/* The seal rolls left → right across the fold on scroll, laying a tyre
   track behind it, and pulls up beside the BKT mark. Rotation is derived
   from distance travelled, so it never skids. */
const Trail = () => {
  const track = useRef(null)
  const [w, setW] = useState(0)
  const p = ease(useScrollProgress(track, 0.95, 0.35))

  useEffect(() => {
    const el = track.current
    const ro = new ResizeObserver(() => setW(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const S = w < 640 ? 110 : w < 1024 ? 150 : 190 // seal diameter, px
  const bktW = w < 640 ? 150 : w < 1024 ? 240 : 340
  const travel = Math.max(0, w - S - bktW - 48)
  const x = p * travel
  const turn = (x / (Math.PI * S)) * 360

  return (
    <section className="overflow-hidden bg-white py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Part of the
            <br />
            <span className="text-brand">MV Dugar Group.</span>
          </h2>
          <p className="max-w-[40ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{line}</p>
        </div>

        <div ref={track} className="relative mt-16" style={{ height: S }}>
          {/* Road line */}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ink/15" />
          {/* Tread marks laid behind the seal */}
          <span
            aria-hidden="true"
            className="absolute bottom-[3px] left-0 h-5 opacity-[0.16]"
            style={{
              width: x + S / 2,
              background: 'repeating-linear-gradient(115deg, var(--color-ink) 0 7px, transparent 7px 18px)',
            }}
          />
          <img
            src={mvLogo}
            alt="MV Dugar Group"
            className="absolute bottom-0 left-0 rounded-full shadow-[0_18px_30px_-16px_rgba(0,0,0,0.5)]"
            style={{ width: S, height: S, transform: `translateX(${x}px) rotate(${turn}deg)` }}
          />
          <img
            src={bktLogo}
            alt="BKT — Growing Together"
            className="absolute bottom-3 right-0"
            style={{ width: bktW, opacity: 0.3 + 0.7 * range(p, 0.7, 1) }}
          />
        </div>

        <div className="mt-14">
          <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 6 · Wheels ───────────────────────────────────────────────────── */

/* Two hubs with tread rings that mesh: scrolling turns them in opposite
   directions. Only the rings turn — the marks stay upright. */
const Tread = ({ angle, children }) => (
  <div className="relative aspect-square w-[clamp(11rem,28vw,24rem)]">
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-full"
      style={{
        transform: `rotate(${angle}deg)`,
        background: 'repeating-conic-gradient(from 0deg, #2b2f36 0deg 7deg, #16181c 7deg 12deg)',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 30px 60px -25px rgba(0,0,0,0.9)',
      }}
    />
    <div className="absolute inset-[9%] flex items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-graphite">{children}</div>
  </div>
)

const Wheels = () => {
  const ref = useRef(null)
  const p = useScrollProgress(ref, 1.1, -0.2)
  const a = p * 300

  return (
    <section className="overflow-hidden bg-carbon py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 text-center sm:px-6 lg:px-10">
        <h2 className="font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          Part of the <span className="text-brand">MV Dugar Group.</span>
        </h2>
        <div ref={ref} className="mt-16 flex items-center justify-center">
          <Tread angle={a}>
            <img src={mvLogo} alt="MV Dugar Group" className="h-full w-full" />
          </Tread>
          <div className="-ml-[2%]">
            <Tread angle={-a}>
              <img src={bktLogo} alt="BKT — Growing Together" className="w-[72%]" />
            </Tread>
          </div>
        </div>
        <p className="mx-auto mt-14 max-w-[52ch] font-sans text-base leading-relaxed text-white/70 sm:text-lg">{line}</p>
        <div className="mt-10">
          <WipeLink to="/leadership">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 7 · Magnetic discs ───────────────────────────────────────────── */

const discCopy = {
  null: line,
  mv: 'The group — a Nepali business house since 1884, working across six industries with more than 4,000 people.',
  bkt: 'The brand — genuine BKT tyres for the farm, the site and the road, brought to Nepal since 2021.',
}

const Disc = ({ id, active, setActive, children, className = '' }) => {
  const ref = useRef(null)
  const [off, setOff] = useState({ x: 0, y: 0 })
  const on = active === id
  const dim = active && !on

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
      className={`relative grid aspect-square w-[clamp(9rem,24vw,20rem)] place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-brand ${className}`}
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

const Magnetic = () => {
  const [active, setActive] = useState(null)
  return (
    <section className="overflow-hidden bg-fog py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 text-center sm:px-6 lg:px-10">
        <h2 className="font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          Part of the <span className="text-brand">MV Dugar Group.</span>
        </h2>
        <div className="mt-16 flex items-center justify-center gap-4 sm:gap-10">
          <Disc id="mv" active={active} setActive={setActive} className="shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)]">
            <img src={mvLogo} alt="MV Dugar Group" className="h-full w-full rounded-full" />
          </Disc>
          <span aria-hidden="true" className={`font-wide text-3xl font-extrabold transition-colors duration-500 sm:text-5xl ${active ? 'text-brand' : 'text-ink/25'}`}>
            ×
          </span>
          <Disc id="bkt" active={active} setActive={setActive} className="bg-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.3)]">
            <img src={bktLogo} alt="BKT — Growing Together" className="w-[72%]" />
          </Disc>
        </div>
        {/* Caption swaps with the hovered mark */}
        <div className="relative mx-auto mt-14 h-24 max-w-[52ch] sm:h-20">
          {Object.entries(discCopy).map(([k, t]) => (
            <p
              key={k}
              aria-hidden={String(active) !== k}
              className="absolute inset-0 font-sans text-base leading-relaxed text-ash transition-[opacity,transform] duration-500 sm:text-lg"
              style={{ opacity: String(active) === k ? 1 : 0, transform: `translateY(${String(active) === k ? 0 : 10}px)` }}
            >
              {t}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 8 · Card fan ─────────────────────────────────────────────────── */

const Fan = () => {
  const ref = useRef(null)
  const seen = useInView(ref, 0.4)
  const [front, setFront] = useState('mv')
  const [hover, setHover] = useState(null)

  const card = (id) => {
    const left = id === 'mv'
    const lifted = hover === id
    const base = seen ? (left ? 'translateX(-42%) rotate(-9deg)' : 'translateX(42%) rotate(8deg)') : 'translateX(0) rotate(0deg)'
    return {
      transform: `${base} ${lifted ? 'translateY(-18px) rotate(' + (left ? 5 : -4) + 'deg) scale(1.03)' : ''}`,
      zIndex: front === id ? 2 : 1,
      transition: 'transform 900ms cubic-bezier(.16,1,.3,1)',
    }
  }

  const props = (id) => ({
    type: 'button',
    onPointerEnter: () => setHover(id),
    onPointerLeave: () => setHover(null),
    onClick: () => setFront(id),
    style: card(id),
  })

  return (
    <section className="overflow-hidden bg-carbon py-24 text-white sm:py-32">
      <div className="mx-auto grid max-w-[100rem] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-10">
        <div>
          <h2 className="font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Part of the
            <br />
            <span className="text-brand">MV Dugar Group.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] font-sans text-base leading-relaxed text-white/70 sm:text-lg">{line}</p>
          <div className="mt-10">
            <WipeLink to="/leadership">Meet the leadership</WipeLink>
          </div>
        </div>

        <div ref={ref} className="relative mx-auto grid h-[26rem] w-full place-items-center sm:h-[30rem]">
          <button {...props('mv')} className="absolute flex aspect-[3/4] w-[min(52vw,17rem)] flex-col items-center justify-center gap-6 rounded-3xl bg-white p-6 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
            <img src={mvLogo} alt="MV Dugar Group" className="w-[70%] rounded-full" />
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-ash">The group · 1884</span>
          </button>
          <button {...props('bkt')} className="absolute flex aspect-[3/4] w-[min(52vw,17rem)] flex-col items-center justify-center gap-6 rounded-3xl bg-brand p-6 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
            <span className="rounded-2xl bg-white px-4 py-5">
              <img src={bktLogo} alt="BKT — Growing Together" className="w-full" />
            </span>
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/80">The brand · 2021</span>
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── 9 · Zoom out (pinned, desktop) ───────────────────────────────── */

/* Starts with the BKT plate filling the screen; scrolling pulls back to
   show it sitting in a panel beside the MV seal. The scale origin is the
   plate's centre, and the panel slides so that centre starts mid-screen. */
const ZoomPanel = ({ style, textStyle }) => (
  <div className="grid w-[min(92vw,80rem)] grid-cols-2 items-center gap-10 rounded-[2rem] bg-carbon p-12 text-white" style={style}>
    <div style={textStyle}>
      <img src={mvLogo} alt="MV Dugar Group" className="h-32 w-32 rounded-full" />
      <h2 className="mt-8 font-wide text-[clamp(2rem,3.6vw,3.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
        Part of the
        <br />
        <span className="text-brand">MV Dugar Group.</span>
      </h2>
      <p className="mt-5 max-w-[42ch] font-sans text-base leading-relaxed text-white/70 sm:text-lg">{line}</p>
      <div className="mt-8">
        <WipeLink to="/leadership">Meet the leadership</WipeLink>
      </div>
    </div>
    <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-white p-[12%]">
      <img src={bktLogo} alt="BKT — Growing Together" className="w-full" />
    </div>
  </div>
)

const Zoom = () => {
  const wrap = useRef(null)
  const p = usePinProgress(wrap)
  const e = ease(range(p, 0.05, 0.75))
  const s = 3.2 - 2.2 * e
  const t = range(p, 0.5, 0.85)

  return (
    <section className="bg-white">
      <div ref={wrap} className="relative hidden lg:block" style={{ height: '240vh' }}>
        <div className="sticky top-24 flex h-[calc(100svh-6rem)] items-center justify-center overflow-hidden">
          <ZoomPanel
            style={{ transform: `translateX(${-25 * (1 - e)}%) scale(${s})`, transformOrigin: '75% 50%' }}
            textStyle={{ opacity: t, transform: `translateY(${(1 - t) * 30}px)`, pointerEvents: t > 0.9 ? 'auto' : 'none' }}
          />
        </div>
      </div>
      <div className="px-4 py-20 sm:px-6 lg:hidden">
        <div className="rounded-[2rem] bg-carbon p-8 text-white">
          <img src={mvLogo} alt="MV Dugar Group" className="h-24 w-24 rounded-full" />
          <h2 className="mt-6 font-wide text-[clamp(2rem,7vw,3rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Part of the <span className="text-brand">MV Dugar Group.</span>
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-white/70">{line}</p>
          <div className="mt-8 rounded-3xl bg-white p-8">
            <img src={bktLogo} alt="BKT — Growing Together" className="w-full" />
          </div>
          <div className="mt-8">
            <WipeLink to="/leadership">Meet the leadership</WipeLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Shared heading for rounds 10–15 */
const H = ({ center = false, className = '' }) => (
  <h2 className={`font-wide text-[clamp(2.2rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight ${center ? 'text-center' : ''} ${className}`}>
    Part of the {center ? null : <br />}
    <span className="text-brand">MV Dugar Group.</span>
  </h2>
)

/* ── 10 · Gauge ───────────────────────────────────────────────────── */

/* A speedometer: the needle sweeps from the MV seal (1884) to BKT (2021)
   as the fold scrolls through, and the readout counts the years. */
const Gauge = () => {
  const ref = useRef(null)
  const p = ease(useScrollProgress(ref, 0.95, 0.3))
  const R = 250
  const len = Math.PI * R
  const year = Math.round(1884 + (2021 - 1884) * p)
  const ticks = Array.from({ length: 31 }, (_, i) => i * 6)

  return (
    <section className="overflow-hidden bg-carbon py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 text-center sm:px-6 lg:px-10">
        <H center />
        <div ref={ref} className="relative mx-auto mt-14 max-w-3xl">
          <svg viewBox="0 0 600 330" className="w-full" aria-hidden="true">
            <path d={`M50 300 A${R} ${R} 0 0 1 550 300`} fill="none" stroke="#23262c" strokeWidth="22" strokeLinecap="round" />
            <path
              d={`M50 300 A${R} ${R} 0 0 1 550 300`}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - p)}
            />
            {ticks.map((d) => {
              const a = ((180 - d) * Math.PI) / 180
              const major = d % 30 === 0
              const r1 = R - 26
              const r2 = R - (major ? 50 : 38)
              return (
                <line
                  key={d}
                  x1={300 + r1 * Math.cos(a)}
                  y1={300 - r1 * Math.sin(a)}
                  x2={300 + r2 * Math.cos(a)}
                  y2={300 - r2 * Math.sin(a)}
                  stroke={d <= p * 180 ? '#8cc63f' : 'rgba(255,255,255,0.25)'}
                  strokeWidth={major ? 4 : 2}
                  strokeLinecap="round"
                />
              )
            })}
            <g transform={`rotate(${180 * p} 300 300)`}>
              <path d="M300 292 L78 300 L300 308 Z" fill="#fff" />
            </g>
            <circle cx="300" cy="300" r="20" fill="#16181c" stroke="#fff" strokeWidth="4" />
          </svg>

          <p className="absolute inset-x-0 top-[44%] font-display text-[clamp(3.5rem,9vw,7rem)] font-black italic leading-none tabular-nums">{year}</p>

          <div className="mt-4 flex items-start justify-between">
            <div className="flex w-32 flex-col items-center gap-3 sm:w-40">
              <img src={mvLogo} alt="MV Dugar Group" className="h-16 w-16 rounded-full sm:h-20 sm:w-20" />
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60">Group · 1884</span>
            </div>
            <div className="flex w-32 flex-col items-center gap-3 transition-opacity duration-500 sm:w-40" style={{ opacity: 0.3 + 0.7 * range(p, 0.85, 1) }}>
              <span className="flex h-16 items-center rounded-xl bg-white px-3 sm:h-20">
                <img src={bktLogo} alt="BKT — Growing Together" className="w-24 sm:w-28" />
              </span>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60">Brand · 2021</span>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-[52ch] font-sans text-base leading-relaxed text-white/70 sm:text-lg">{line}</p>
        <div className="mt-10">
          <WipeLink to="/leadership">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 11 · Drag to roll ────────────────────────────────────────────── */

/* The visitor rolls the seal to BKT themselves. Let go past halfway and
   it finishes the trip; arrow keys work too. Arriving opens the copy. */
const DragRoll = () => {
  const track = useRef(null)
  const drag = useRef(null)
  const [w, setW] = useState(0)
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = track.current
    const ro = new ResizeObserver(() => setW(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const S = w < 640 ? 96 : 150
  const bktW = w < 640 ? 130 : 280
  const travel = Math.max(1, w - S - bktW - 40)
  const pos = Math.min(x, travel)
  const done = pos >= travel - 1
  const turn = (pos / (Math.PI * S)) * 360

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { start: e.clientX, from: pos }
    setDragging(true)
  }
  const move = (e) => {
    if (!drag.current) return
    setX(Math.min(travel, Math.max(0, drag.current.from + e.clientX - drag.current.start)))
  }
  const up = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    setX((v) => (v > travel * 0.5 ? travel : 0))
  }
  const key = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setX(travel)
    }
    if (e.key === 'ArrowLeft') setX(0)
  }

  return (
    <section className="overflow-hidden bg-white py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <H />
        <div ref={track} className="relative mt-16 select-none" style={{ height: S + 20 }}>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 rounded-full bg-fog" />
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-1.5 rounded-full bg-brand" style={{ width: pos + S / 2, transition: dragging ? 'none' : 'width 700ms cubic-bezier(.16,1,.3,1)' }} />
          <button
            type="button"
            aria-label="Roll the MV Dugar seal to BKT"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onKeyDown={key}
            className="absolute bottom-3 left-0 cursor-grab touch-none rounded-full outline-none focus-visible:ring-4 focus-visible:ring-brand active:cursor-grabbing"
            style={{
              width: S,
              height: S,
              transform: `translateX(${pos}px) rotate(${turn}deg)`,
              transition: dragging ? 'none' : 'transform 700ms cubic-bezier(.16,1,.3,1)',
            }}
          >
            <img src={mvLogo} alt="" draggable="false" className="h-full w-full rounded-full shadow-[0_18px_30px_-14px_rgba(0,0,0,0.5)]" />
          </button>
          {!done && pos === 0 && (
            <span className="pointer-events-none absolute bottom-[calc(50%+4px)] font-mono text-[11px] uppercase tracking-[0.2em] text-ash motion-safe:animate-pulse" style={{ left: S + 20 }}>
              Drag the seal →
            </span>
          )}
          <img
            src={bktLogo}
            alt="BKT — Growing Together"
            className="absolute bottom-5 right-0 transition-[opacity,transform] duration-700"
            style={{ width: bktW, opacity: done ? 1 : 0.25, transform: done ? 'scale(1)' : 'scale(0.94)' }}
          />
        </div>

        <div
          className="mt-14 flex flex-col gap-8 transition-[opacity,transform] duration-700 sm:flex-row sm:items-center sm:justify-between"
          style={{ opacity: done ? 1 : 0.35, transform: done ? 'none' : 'translateY(8px)' }}
        >
          <p className="max-w-[52ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{line}</p>
          <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 12 · Road sign ───────────────────────────────────────────────── */

/* A green motorway sign — the brand green is already sign green — over a
   road whose lane dashes run with the scroll. The sign approaches. */
const RoadSign = () => {
  const ref = useRef(null)
  const raw = useScrollProgress(ref, 1.1, -0.3)
  const p = ease(range(raw, 0, 0.6))

  return (
    <section ref={ref} className="relative overflow-hidden bg-carbon text-white">
      {/* Road plane */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[55%] [perspective:500px]">
        <div
          className="absolute inset-x-[-40%] bottom-[-10%] top-0 origin-bottom bg-[#1b1d21]"
          style={{
            transform: 'rotateX(62deg)',
            backgroundImage:
              'linear-gradient(90deg, transparent 18%, rgba(255,255,255,0.5) 18%, rgba(255,255,255,0.5) calc(18% + 4px), transparent calc(18% + 4px), transparent calc(82% - 4px), rgba(255,255,255,0.5) calc(82% - 4px), rgba(255,255,255,0.5) 82%, transparent 82%)',
            maskImage: 'linear-gradient(to bottom, transparent, black 35%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 35%)',
          }}
        >
          {/* Centre dashes, running with the scroll */}
          <span
            className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, #f4f5f6 0 70px, transparent 70px 140px)',
              backgroundPositionY: `${raw * 1400}px`,
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[44rem] max-w-[100rem] flex-col items-center px-4 pb-16 pt-20 sm:px-6 lg:px-10">
        <div className="origin-bottom" style={{ transform: `scale(${0.62 + 0.38 * p})`, opacity: 0.4 + 0.6 * p }}>
          <div className="rounded-2xl border-[5px] border-white bg-brand p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] outline outline-4 outline-brand sm:p-10">
            <div className="flex items-center gap-5">
              <img src={mvLogo} alt="MV Dugar Group" className="h-16 w-16 rounded-full ring-4 ring-white sm:h-24 sm:w-24" />
              <p className="font-wide text-[clamp(1.6rem,4vw,3.25rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
                MV Dugar
                <br />
                Group
              </p>
            </div>
            <div className="my-6 h-1 rounded-full bg-white/90" />
            <div className="flex items-center gap-5">
              <svg viewBox="0 0 24 24" className="h-14 w-14 shrink-0 sm:h-20 sm:w-20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21V4M5 11l7-7 7 7" />
              </svg>
              <span className="rounded-xl bg-white px-4 py-3">
                <img src={bktLogo} alt="BKT — Growing Together" className="w-[min(46vw,15rem)]" />
              </span>
            </div>
          </div>
          {/* Posts */}
          <div aria-hidden="true" className="mx-auto flex w-2/3 justify-between">
            <span className="h-24 w-3 bg-gradient-to-b from-[#8a9099] to-[#3a3f46]" />
            <span className="h-24 w-3 bg-gradient-to-b from-[#8a9099] to-[#3a3f46]" />
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-8 pt-14 text-center">
          <p className="max-w-[52ch] rounded-full bg-carbon/70 px-6 py-3 font-sans text-base leading-relaxed text-white/85 backdrop-blur-sm sm:text-lg">{line}</p>
          <WipeLink to="/leadership">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── 13 · Spin the tyre ───────────────────────────────────────────── */

/* A tyre whose sidewall reads BKT · GROWING TOGETHER round the rim and
   whose hub is the MV seal. Drag (or flick) to spin it; scrolling turns it
   too. Inertia decays naturally. */
const SpinTyre = () => {
  const wheel = useRef(null)
  const st = useRef({ a: 0, v: 0, drag: null, lastY: 0 })

  useEffect(() => {
    const s = st.current
    s.lastY = window.scrollY
    if (reduced()) return
    let raf
    const tick = () => {
      if (!s.drag) {
        s.a += s.v
        s.v *= 0.95
      }
      if (wheel.current) wheel.current.style.transform = `rotate(${s.a}deg)`
      raf = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      const y = window.scrollY
      if (!s.drag) s.v += (y - s.lastY) * 0.02
      s.lastY = y
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const angleAt = (e) => {
    const r = wheel.current.getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }
  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    st.current.drag = { last: angleAt(e) }
    st.current.v = 0
  }
  const move = (e) => {
    const s = st.current
    if (!s.drag) return
    const now = angleAt(e)
    let d = now - s.drag.last
    if (d > 180) d -= 360
    if (d < -180) d += 360
    s.a += d
    s.v = d
    s.drag.last = now
  }
  const up = () => {
    st.current.drag = null
  }

  const sidewall = 'BKT · GROWING TOGETHER · PART OF THE MV DUGAR GROUP · '
  const lugs = Array.from({ length: 48 }, (_, i) => i * 7.5)

  return (
    <section className="overflow-hidden bg-fog py-24 text-ink sm:py-32">
      <div className="mx-auto grid max-w-[100rem] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10">
        <div className="relative mx-auto w-full max-w-[34rem]">
          <div
            ref={wheel}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            className="relative aspect-square cursor-grab touch-none select-none active:cursor-grabbing"
          >
            <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <path id="sw" d="M250 250 m-188 0 a188 188 0 1 1 376 0 a188 188 0 1 1 -376 0" />
              </defs>
              {/* Tread lugs */}
              {lugs.map((d) => (
                <rect key={d} x="241" y="2" width="18" height="30" rx="4" fill="#16181c" transform={`rotate(${d} 250 250)`} />
              ))}
              <circle cx="250" cy="250" r="226" fill="#16181c" />
              <circle cx="250" cy="250" r="214" fill="#23262c" />
              <text fill="#f4f5f6" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="23" letterSpacing="3">
                <textPath href="#sw" textLength={2 * Math.PI * 188 - 14} lengthAdjust="spacing">
                  {sidewall}
                </textPath>
              </text>
              <circle cx="250" cy="250" r="160" fill="#16181c" />
              <circle cx="250" cy="250" r="150" fill="none" stroke="#5b616b" strokeWidth="6" />
            </svg>
            <img src={mvLogo} alt="MV Dugar Group" draggable="false" className="absolute left-1/2 top-1/2 w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Drag to spin</p>
        </div>

        <div>
          <img src={bktLogo} alt="BKT — Growing Together" className="w-56 sm:w-72" />
          <H className="mt-10" />
          <p className="mt-6 max-w-[46ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{line}</p>
          <div className="mt-10">
            <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 14 · Hubcap ──────────────────────────────────────────────────── */

/* The MV seal is the hubcap. When the fold comes into view it unscrews
   and swings off to reveal BKT underneath; hover or tap puts it back. */
const Hubcap = () => {
  const ref = useRef(null)
  const seen = useInView(ref, 0.5)
  const [closed, setClosed] = useState(false)
  const open = seen && !closed

  return (
    <section className="overflow-hidden bg-carbon py-24 text-white sm:py-32">
      <div className="mx-auto grid max-w-[100rem] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-10">
        <div>
          <H />
          <p className="mt-6 max-w-[46ch] font-sans text-base leading-relaxed text-white/70 sm:text-lg">{line}</p>
          <div className="mt-10">
            <WipeLink to="/leadership">Meet the leadership</WipeLink>
          </div>
        </div>

        <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[30rem]">
          <button
            type="button"
            aria-label={open ? 'Put the hubcap back' : 'Take the hubcap off'}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setClosed(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setClosed(false)}
            onClick={() => setClosed((c) => !c)}
            className="absolute inset-0 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-brand-glow"
          >
            {/* Tyre */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background: 'repeating-conic-gradient(from 0deg, #2b2f36 0deg 6deg, #16181c 6deg 10deg)',
                boxShadow: '0 40px 80px -30px rgba(0,0,0,0.9)',
              }}
            />
            <span aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[#2b2f36] ring-[10px] ring-[#9aa0a8]" />
            {/* What's under the cap */}
            <span className="absolute inset-[16%] flex flex-col items-center justify-center rounded-full bg-white">
              <img src={bktLogo} alt="BKT — Growing Together" className="w-[64%]" />
            </span>
            {/* Cap */}
            <img
              src={mvLogo}
              alt="MV Dugar Group"
              className="absolute inset-[14%] h-[72%] w-[72%] rounded-full shadow-[0_30px_50px_-20px_rgba(0,0,0,0.8)]"
              style={{
                transform: open ? 'translate(62%, -58%) rotate(-200deg) scale(0.5)' : 'translate(0,0) rotate(0deg) scale(1)',
                transition: 'transform 1100ms cubic-bezier(.65,0,.35,1)',
              }}
            />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── 15 · Race track ──────────────────────────────────────────────── */

/* The seal laps an oval circuit round the BKT mark, laying a green trail
   behind it. Hovering the track puts its foot down. */
const TRACK = 'M210 60 H790 A150 150 0 0 1 790 360 H210 A150 150 0 0 1 210 60 Z'

const RaceTrack = () => {
  const path = useRef(null)
  const car = useRef(null)
  const trail = useRef(null)
  const fast = useRef(false)

  useEffect(() => {
    const p = path.current
    const L = p.getTotalLength()
    const tail = L * 0.18
    let d = 0
    let v = 0
    let last = performance.now()
    let raf
    const still = reduced()
    const tick = (t) => {
      const dt = Math.min(50, t - last)
      last = t
      const target = fast.current ? 0.75 : 0.25
      v += (target - v) * 0.04
      if (!still) d = (d + v * dt) % L
      const pt = p.getPointAtLength(d)
      if (car.current) car.current.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${(d / (Math.PI * 80)) * 360})`)
      if (trail.current) {
        trail.current.setAttribute('stroke-dasharray', `${tail} ${L - tail}`)
        trail.current.setAttribute('stroke-dashoffset', `${-(d - tail)}`)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="overflow-hidden bg-white py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <H center />
        <div
          className="relative mx-auto mt-14 max-w-5xl"
          onPointerEnter={() => (fast.current = true)}
          onPointerLeave={() => (fast.current = false)}
        >
          <svg viewBox="0 0 1000 420" className="w-full" aria-hidden="true">
            <path d={TRACK} fill="none" stroke="#16181c" strokeWidth="64" />
            {/* Kerbs */}
            <path d={TRACK} fill="none" stroke="#f4f5f6" strokeWidth="64" strokeDasharray="14 14" opacity="0.18" />
            <path d={TRACK} fill="none" stroke="#16181c" strokeWidth="52" />
            <path ref={path} d={TRACK} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="18 16" />
            <path ref={trail} d={TRACK} fill="none" stroke="var(--color-brand)" strokeWidth="10" strokeLinecap="round" />
            <g ref={car}>
              <image href={mvLogo} x="-40" y="-40" width="80" height="80" />
            </g>
          </svg>
          {/* Infield */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={bktLogo} alt="BKT — Growing Together" className="w-[34%]" />
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-8 text-center">
          <p className="max-w-[52ch] font-sans text-base leading-relaxed text-ash sm:text-lg">{line}</p>
          <WipeLink to="/leadership" tone="light">Meet the leadership</WipeLink>
        </div>
      </div>
    </section>
  )
}

/* ── Lab shell ────────────────────────────────────────────────────── */

const options = [
  { id: '1', name: 'Roll', note: 'Scroll: the MV seal rolls in like a wheel and comes to rest as a badge on the BKT plate.', C: Roll },
  { id: '2', name: 'Tilt', note: 'Both marks fly in at different depths, then the pair tilts in 3D with your cursor.', C: Tilt },
  { id: '3', name: 'Reveal', note: 'Pinned scroll: the seal spins up to the top, a green circle grows out of it, and BKT rises in the middle.', C: Reveal },
  { id: '4', name: 'Slabs', note: 'Home’s skewed slabs, one per mark, slide in from opposite sides and lock together. Hover lifts them.', C: Slabs },
  { id: '5', name: 'Tread trail', note: 'Scroll: the seal rolls across the whole width, laying tyre tracks behind it, and pulls up beside BKT.', C: Trail },
  { id: '6', name: 'Wheels', note: 'Both marks sit in tyre-tread rings that turn against each other as you scroll, like meshing wheels.', C: Wheels },
  { id: '7', name: 'Magnetic', note: 'Two discs that pull toward the cursor; hover one and it grows, the other fades, and the line below tells its side.', C: Magnetic },
  { id: '8', name: 'Card fan', note: 'Two cards fan out when they come into view. Hover lifts and straightens a card; click brings it to the front.', C: Fan },
  { id: '9', name: 'Zoom out', note: 'Pinned (desktop): starts on the BKT plate full-screen, then pulls back to reveal the MV panel around it.', C: Zoom },
  { id: '10', name: 'Gauge', note: 'A speedometer: scrolling sweeps the needle from the MV seal (1884) to BKT (2021) while the year counts up.', C: Gauge },
  { id: '11', name: 'Drag to roll', note: 'You roll the seal to BKT yourself — drag it (or press →). Arriving lights BKT and opens the line.', C: DragRoll },
  { id: '12', name: 'Road sign', note: 'A green motorway sign approaches over a road whose lane lines run with the scroll.', C: RoadSign },
  { id: '13', name: 'Spin the tyre', note: 'A tyre with BKT lettering on the sidewall and the MV seal as hub. Drag or flick to spin; scroll turns it too.', C: SpinTyre },
  { id: '14', name: 'Hubcap', note: 'The MV seal is a hubcap that unscrews and swings off to reveal BKT underneath. Hover puts it back.', C: Hubcap },
  { id: '15', name: 'Race track', note: 'The seal laps a circuit round the BKT mark with a green trail. Hover the track and it speeds up.', C: RaceTrack },
]

export default function GroupLab() {
  return (
    <div className="bg-fog pt-24">
      <header className="mx-auto max-w-[100rem] px-4 pb-10 pt-12 sm:px-6 lg:px-10">
        <h1 className="font-wide text-[clamp(2rem,4vw,3.5rem)] font-extrabold uppercase leading-none tracking-tight text-ink">
          BKT × MV Dugar — fifteen options
        </h1>
        <p className="mt-4 max-w-[70ch] font-sans text-base text-ash">Just the two marks, one line and a link, each with its own animation. 1–4 first round, 5–9 second, 10–15 newest. Scroll slowly through each one.</p>
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
          <C />
        </div>
      ))}
      <div className="h-24" />
    </div>
  )
}
