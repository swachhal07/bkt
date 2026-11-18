import { useEffect, useRef } from 'react'

/* Products loading overlay, matching the one on BKT's own product list
   (commercial.bkt-tires.com/products): the page fades behind white at 80%
   with a 2px blur, and in the centre a streak runs round BKT's slanted slab
   outline — dark green at the head, through green, to lime at the tail, over
   a faint green track — completing one eased lap every 1.5s.
   Drawn on a canvas so the streak can fade along its length. */

const LINE = 6 // stroke width, in path units
const TAIL = 0.62 // streak length as a share of the outline
const PERIOD = 1500 // ms per lap
const SAMPLES = 900 // points along the outline
const HEAD = [11, 66, 35]
const MID = [31, 162, 46]
const END = [172, 204, 62]

/* The slab outline (48 × 46 units): straight sides, rounded top-left and
   bottom-right corners. [type, from, c1, c2, to] */
const OUTLINE = [
  ['L', [50.3304, 2.0086], null, null, [45.1474, 35.7612]],
  ['C', [45.1474, 35.7612], [43.9974, 43.2048], [38.9689, 48], [31.3795, 48]],
  ['L', [31.3795, 48], null, null, [2.33044, 47.9871]],
  ['L', [2.33044, 47.9871], null, null, [7.51346, 14.2373]],
  ['C', [7.51346, 14.2373], [8.66209, 6.79232], [13.692, 2], [21.2829, 2]],
  ['L', [21.2829, 2], null, null, [50.3304, 2.0086]],
]

const bezier = (a, b, c, d, t) => {
  const r = 1 - t
  return {
    x: r ** 3 * a[0] + 3 * r ** 2 * t * b[0] + 3 * r * t ** 2 * c[0] + t ** 3 * d[0],
    y: r ** 3 * a[1] + 3 * r ** 2 * t * b[1] + 3 * r * t ** 2 * c[1] + t ** 3 * d[1],
  }
}

/* sample the outline into evenly indexed points */
const POINTS = (() => {
  const per = Math.floor(SAMPLES / OUTLINE.length)
  const pts = []
  for (const [type, a, b, c, d] of OUTLINE) {
    for (let i = 0; i < per; i++) {
      const t = i / per
      pts.push(type === 'L' ? { x: a[0] + (d[0] - a[0]) * t, y: a[1] + (d[1] - a[1]) * t } : bezier(a, b, c, d, t))
    }
  }
  return pts
})()
const N = POINTS.length
const TAIL_N = Math.floor(N * TAIL)
const PAD = LINE / 2 + 1
const W = 50.3304 - 2.33044
const H = 46

/* ease-in-out lap: solve x(t) of a cubic curve, return y(t) */
const curveX = (t) => 3 * t * (1 - t) ** 2 * 0.33 + t ** 3
const curveY = (t) => 3 * t ** 2 * (1 - t) + t ** 3
const ease = (x) => {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (curveX(mid) < x) lo = mid
    else hi = mid
  }
  return curveY((lo + hi) / 2)
}

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const colourAt = (t) => (t < 0.45 ? mix(HEAD, MID, t / 0.45) : mix(MID, END, (t - 0.45) / 0.55))

function SlabTrace({ size = 48 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    let raf = 0
    let start = 0

    const frame = (now) => {
      if (!start) start = now
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      const boxW = W + PAD * 2
      const boxH = H + PAD * 2
      const k = Math.min(w / boxW, h / boxH)
      const ox = (w - boxW * k) / 2 + (PAD - 2.33044) * k
      const oy = (h - boxH * k) / 2 + (PAD - 2) * k
      const at = (p) => ({ x: ox + p.x * k, y: oy + p.y * k })
      ctx.lineWidth = LINE * k
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      /* faint track */
      ctx.strokeStyle = 'rgba(0, 119, 52, 0.09)'
      ctx.beginPath()
      const first = at(POINTS[0])
      ctx.moveTo(first.x, first.y)
      for (let i = 1; i < N; i++) {
        const p = at(POINTS[i])
        ctx.lineTo(p.x, p.y)
      }
      ctx.closePath()
      ctx.stroke()

      /* streak: segments fade in alpha and shift colour along its length */
      const head = Math.floor(ease(((now - start) % PERIOD) / PERIOD) * N)
      for (let j = 1; j < TAIL_N; j++) {
        const i = (head - TAIL_N + j + N * 4) % N
        const prev = (i - 1 + N) % N
        const t = j / TAIL_N
        const [r, g, b] = colourAt(t)
        const a = at(POINTS[prev])
        const c = at(POINTS[i])
        ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(t * t).toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(c.x, c.y)
        ctx.stroke()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [size])

  return <canvas ref={ref} style={{ width: size, height: size }} aria-hidden="true" />
}

export default function BktLoader({ show, label = 'Loading tyres' }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
      <div role="status" aria-live="polite">
        <SlabTrace />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  )
}
