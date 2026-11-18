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

    /* Everything that doesn't change between frames is worked out once:
       the outline in canvas pixels and the faint track as a Path2D. */
    const w = canvas.width
    const h = canvas.height
    const boxW = W + PAD * 2
    const boxH = H + PAD * 2
    const k = Math.min(w / boxW, h / boxH)
    const ox = (w - boxW * k) / 2 + (PAD - 2.33044) * k
    const oy = (h - boxH * k) / 2 + (PAD - 2) * k
    const pts = POINTS.map((p) => [ox + p.x * k, oy + p.y * k])
    const track = new Path2D()
    track.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < N; i++) track.lineTo(pts[i][0], pts[i][1])
    track.closePath()
    ctx.lineWidth = LINE * k
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    /* The streak is drawn in CHUNKS pieces (one colour/alpha each) rather
       than one stroke per sample — same look, ~20× fewer draw calls. */
    const CHUNKS = 28
    const per = Math.ceil(TAIL_N / CHUNKS)

    const frame = (now) => {
      if (!start) start = now
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(0, 119, 52, 0.09)'
      ctx.stroke(track)

      const head = Math.floor(ease(((now - start) % PERIOD) / PERIOD) * N)
      for (let c = 0; c < CHUNKS; c++) {
        const j0 = c * per
        const j1 = Math.min(TAIL_N - 1, j0 + per)
        if (j0 >= j1) break
        const t = (j0 + j1) / 2 / TAIL_N
        const [r, g, bl] = colourAt(t)
        ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${bl | 0}, ${(t * t).toFixed(3)})`
        ctx.beginPath()
        for (let j = j0; j <= j1; j++) {
          const [x, y] = pts[(head - TAIL_N + j + N * 4) % N]
          if (j === j0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
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
