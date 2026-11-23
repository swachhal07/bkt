/* Tyre-size matching for the finder and the size tables.

   People type sizes every which way — "12.4-28", "12.4 28", "12.4x28",
   "600/70R30", "600 70 30" — and BKT and the range PDFs write them as
   "12.4 - 28", "VF 600/70 R 30 SL" or "12.4-28 12PR". So sizes are compared
   as their run of numbers, not as text:

     "VF 600/70 R 30 SL" → 600 · 70 · 30
     "12.4-28 12PR"      → 12.4 · 28       (ply rating dropped)

   A query matches when its numbers appear in a row inside the size's
   numbers. The last query number may be half-typed, so "12.4-2" already
   finds 12.4-28 while the visitor is still typing. */

const numbers = (s) =>
  String(s)
    .replace(/\d+\s*PR\b/gi, ' ') // ply rating is not part of the size
    .match(/\d+(?:\.\d+)?/g) ?? []

export const hasSizeQuery = (q) => numbers(q).length > 0

export function sizeMatches(size, query) {
  const q = numbers(query)
  if (!q.length) return true
  const s = numbers(size)
  for (let i = 0; i + q.length <= s.length; i++) {
    let ok = true
    for (let j = 0; j < q.length && ok; j++) {
      const last = j === q.length - 1
      ok = last ? s[i + j].startsWith(q[j]) : s[i + j] === q[j]
    }
    if (ok) return true
  }
  return false
}

/* The distinct nominal sizes of a tyre that match, BKT table first, then any
   size only the Nepal stock list gives. */
export function matchingSizes(p, query) {
  if (!hasSizeQuery(query)) return []
  const seen = new Set()
  const out = []
  const add = (label) => {
    const key = numbers(label).join(' ')
    if (seen.has(key)) return
    seen.add(key)
    out.push(label)
  }
  p.sizes.forEach((s) => sizeMatches(s.size, query) && add(s.size))
  p.stock.forEach((s) => sizeMatches(s, query) && add(s))
  return out
}

/* Contact-page link that carries the tyre and size into the enquiry form. */
export const enquiryHref = ({ tyre, size } = {}) => {
  const q = new URLSearchParams()
  if (tyre) q.set('tyre', tyre)
  if (size) q.set('size', size)
  const s = q.toString()
  return `/contact${s ? `?${s}` : ''}#enquiry`
}
