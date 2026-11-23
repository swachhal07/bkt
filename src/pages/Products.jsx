import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, sectors, productBySlug, rangeGroups } from '../data/products'
import { hasSizeQuery, matchingSizes, enquiryHref } from '../data/sizeMatch'
import MachinePicker from '../components/MachinePicker'
import { Kicker, WipeLink, ProductCard, useReveal } from '../components/productUi'

/* ────────────────────────────────────────────────────────────────────
   PRODUCTS — the BKT range we supply.

     1  HERO     white split: headline left, three tyres standing on a
                 skewed brand slab right
     2  RANGE    fog — the tyre finder: size search (?size=) and one picker
                 for sector (?sector=) or machine (?machine=), over a
                 grid of tyre cards; each card opens /products/:slug, with the
                 matched size searched when the finder is in use
   ──────────────────────────────────────────────────────────────────── */

/* Infinite scroll, as on BKT's product list: 12 tyres first, then 10 more
   each time the end of the grid comes within 600px of the screen — appended
   straight away, no overlay. */
const FIRST = 12
const NEXT = 10
const AHEAD = 600

/* One-tap sizes under the finder — common sizes from the Nepal range PDFs. */
const popularSizes = [
  { size: '12.4-28', sector: 'agriculture' },
  { size: '13.6-28', sector: 'agriculture' },
  { size: '14.9-28', sector: 'agriculture' },
  { size: '18.4-30', sector: 'agriculture' },
  { size: '9.5-24', sector: 'agriculture' },
  { size: '10.00-20', sector: 'otr' },
  { size: '17.5-25', sector: 'otr' },
  { size: '12.5/80-18', sector: 'otr' },
]

/* Hero lineup: back-left, back-right, front-centre. */
const lineup = [
  { p: productBySlug('earthmax-sr-45-m'), cls: 'left-0 bottom-[11%] h-[64%] -rotate-[5deg]', delay: 260 },
  { p: productBySlug('xl-grip-l3'), cls: 'right-0 bottom-[11%] h-[60%] rotate-[6deg]', delay: 360 },
  { p: productBySlug('agrimax-force'), cls: 'left-1/2 -translate-x-1/2 bottom-[7%] h-[90%]', delay: 160 },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const active = sectors.some((s) => s.id === params.get('sector')) ? params.get('sector') : 'all'
  const activeSector = sectors.find((s) => s.id === active)

  /* Finder. The size box keeps its own state so typing stays instant; the URL
     follows it (replace, no scroll) so a search can be shared or bookmarked. */
  const [size, setSize] = useState(params.get('size') ?? '')
  const machine = rangeGroups.some((g) => g.id === params.get('machine')) ? params.get('machine') : ''

  /* The picker holds both levels: a whole sector ("sector:otr", kept in
     ?sector= so links from the breadcrumb and Home still land filtered) or
     one machine (?machine=). Choosing either clears the other. */
  const pickerValue = machine || (active !== 'all' ? `sector:${active}` : '')
  const onPicker = (v) => {
    const next = new URLSearchParams(params)
    next.delete('sector')
    next.delete('machine')
    if (v.startsWith('sector:')) next.set('sector', v.slice(7))
    else if (v) next.set('machine', v)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const sizing = hasSizeQuery(size)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const onSize = (e) => {
    setSize(e.target.value)
    setParam('size', e.target.value.trim())
  }
  const clearFinder = () => {
    setSize('')
    const next = new URLSearchParams(params)
    next.delete('size')
    next.delete('machine')
    next.delete('sector')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  /* every tyre with the sizes it matched (all tyres match an empty search) */
  const matched = useMemo(
    () => products
      .map((p) => ({ p, m: matchingSizes(p, size) }))
      .filter(({ m }) => !sizing || m.length > 0),
    [size, sizing],
  )
  /* Picker contents: each sector's machines, and how many tyres each choice
     would show for the size typed so far. */
  const pickerColumns = sectors.map((s) => ({
    id: s.id,
    name: s.name,
    allLabel: `All ${s.id === 'otr' ? 'OTR' : s.name.toLowerCase()} tyres`,
    groups: rangeGroups.filter((g) => g.sector === s.id),
  }))
  const pickerLabel = (v) => {
    if (!v) return 'All machines'
    if (v.startsWith('sector:')) return pickerColumns.find((c) => `sector:${c.id}` === v)?.allLabel ?? 'All machines'
    return rangeGroups.find((g) => g.id === v)?.name ?? 'All machines'
  }
  const pickerCount = (v) => {
    if (!v) return matched.length
    if (v.startsWith('sector:')) return matched.filter(({ p }) => p.sectors.includes(v.slice(7))).length
    return matched.filter(({ p }) => p.groups.includes(v)).length
  }
  const shown = matched.filter(({ p }) =>
    (active === 'all' || p.sectors.includes(active)) && (!machine || p.groups.includes(machine)),
  )

  useReveal('products')

  const [count, setCount] = useState(FIRST)
  const sentinel = useRef(null)
  const more = count < shown.length

  useEffect(() => {
    setCount(FIRST)
  }, [active, size, machine])

  const loadMore = () => {
    if (!more) return
    setCount((c) => c + NEXT)
  }

  /* Watch the end of the grid. An IntersectionObserver with BKT's 600px
     margin, backed by a scroll/resize check for browsers that don't fire it. */
  useEffect(() => {
    if (!more) return
    const near = () => {
      const el = sentinel.current
      if (el && el.getBoundingClientRect().top < window.innerHeight + AHEAD) loadMore()
    }
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && loadMore(), { rootMargin: `${AHEAD}px` })
      : null
    if (io && sentinel.current) io.observe(sentinel.current)
    near()
    window.addEventListener('scroll', near, { passive: true })
    window.addEventListener('resize', near)
    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', near)
      window.removeEventListener('resize', near)
    }
  })

  return (
    <>
      {/* ══ 1 · HERO ═════════════════════════════════════════════════ */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-[100rem] flex-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:py-16">
          {/* Centred while stacked over the lineup; left-aligned beside it from lg. */}
          <div className="text-center lg:col-span-6 lg:text-left">
            <div className="anim-rise">
              <Kicker className="lg:justify-start">Products</Kicker>
            </div>
            <h1 className="font-wide anim-lines mt-8 text-[clamp(2.4rem,9.5vw,4.25rem)] lg:text-[clamp(2.5rem,min(4.7vw,10vh),5.75rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink">
              <span className="line-mask">
                <span>Built for the</span>
              </span>
              <span className="line-mask">
                <span>field, the site</span>
              </span>
              <span className="line-mask">
                <span className="text-brand">and the mine.</span>
              </span>
            </h1>
            <p
              className="anim-rise mx-auto mt-8 max-w-[50ch] lg:mx-0 text-base leading-relaxed text-ash sm:text-lg text-pretty"
              style={{ animationDelay: '420ms' }}
            >
              The BKT range we supply across Nepal — agricultural and
              off-the-road tyres, each with its full size table — and most with a 3D model you
              can turn and inspect before you buy.
            </p>
            <div className="anim-rise mt-10 flex flex-wrap justify-center gap-4 lg:justify-start" style={{ animationDelay: '520ms' }}>
              <WipeLink href="#finder">Find your tyre</WipeLink>
              <WipeLink to={enquiryHref()}>Ask for a size</WipeLink>
            </div>
          </div>

          {/* Lineup */}
          <div className="relative mx-auto aspect-[6/5] w-full max-w-xl lg:col-span-6 hero-lineup lg:max-w-none">
            <span
              aria-hidden="true"
              className="prod-stage-slab anim-fade absolute inset-x-[12%] bottom-0 h-[60%] rounded-[2.4rem_0.6rem_2.4rem_0.6rem] bg-brand"
              style={{ '--slab-y': '0%' }}
            />
            {lineup.map(({ p, cls, delay }) => (
              <img
                key={p.slug}
                src={p.image}
                alt={`${p.name} tyre`}
                className={`anim-rise absolute w-auto object-contain drop-shadow-[0_24px_28px_rgb(12_13_15/0.28)] ${cls}`}
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>

      </section>

      {/* ══ 2 · RANGE ════════════════════════════════════════════════ */}
      <section id="range" aria-labelledby="range-title" className="scroll-mt-24 bg-fog py-24 sm:py-32">
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
          <div className="reveal mx-auto max-w-3xl text-center">
            <Kicker>The range</Kicker>
            <h2
              id="range-title"
              className="mt-6 font-wide text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink"
            >
              Pick your ground
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-ash sm:text-lg">
              {activeSector
                ? activeSector.lede
                : 'Two sectors, one standard. Choose where your machine works, then open any tyre for sizes, specs and, where BKT has one, its 3D model.'}
            </p>
          </div>

          {/* ── Tyre finder ──
              Split bar on the fog band (chosen from /finder-lab, option 4):
              the size search and the machine picker as two separate white
              pills, the live count as a slanted brand-green tile in the
              Home stat-slab shape. No outlines; the search pill lifts on a
              soft shadow while in use. Search takes its own row on phones,
              picker and count share the next. Then common Nepal sizes as
              one-tap chips. */}
          <div id="finder" className="reveal relative z-20 mx-auto mt-12 max-w-3xl scroll-mt-28 text-center">
            <h3 className="sr-only">Find your tyre</h3>

            <div className="relative flex flex-col gap-3 text-left sm:flex-row sm:items-center">
              <label className="flex flex-1 items-center gap-3 rounded-full bg-white pl-6 pr-4 transition-shadow duration-300 focus-within:shadow-[0_14px_34px_-18px_rgb(12_13_15/0.3)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-5 w-5 shrink-0 text-brand">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <span className="sr-only">Tyre size</span>
                <input
                  type="search"
                  value={size}
                  onChange={onSize}
                  placeholder="Tyre size, like 12.4-28"
                  autoComplete="off"
                  spellCheck="false"
                  className="h-14 w-full min-w-0 bg-transparent font-sans text-lg font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ash/70"
                />
              </label>

              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center rounded-full bg-white transition-shadow duration-300 focus-within:shadow-[0_14px_34px_-18px_rgb(12_13_15/0.3)] sm:flex-none">
                  <MachinePicker
                    value={pickerValue}
                    onChange={onPicker}
                    columns={pickerColumns}
                    labelFor={pickerLabel}
                    countFor={pickerCount}
                  />
                </div>
                <span
                  aria-live="polite"
                  className="mx-1.5 flex h-14 shrink-0 -skew-x-12 items-center rounded-lg bg-brand px-6"
                >
                  <span className="skew-x-12 whitespace-nowrap font-wide text-lg font-extrabold italic text-white">
                    {shown.length}{' '}
                    <span className="ml-0.5 text-sm font-bold not-italic uppercase tracking-wide text-white/80">
                      {shown.length === 1 ? 'tyre' : 'tyres'}
                    </span>
                  </span>
                </span>
              </div>
            </div>

            {/* One-tap sizes */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {popularSizes
                .filter((p) => active === 'all' || p.sector === active)
                .map((p) => {
                  const on = size.trim() === p.size
                  return (
                    <button
                      key={p.size}
                      type="button"
                      onClick={() => onSize({ target: { value: on ? '' : p.size } })}
                      aria-pressed={on}
                      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium tracking-[0.04em] transition-colors ${
                        on
                          ? 'border-brand/20 bg-mist text-brand'
                          : 'border-ink/12 bg-white text-ash hover:border-ink/30 hover:text-ink'
                      }`}
                    >
                      {p.size}
                    </button>
                  )
                })}
              {(sizing || machine || active !== 'all') && (
                <button
                  type="button"
                  onClick={clearFinder}
                  className="ml-1 font-mono text-[11px] uppercase tracking-[0.14em] text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="mt-4 text-sm text-ash">
              The size is moulded on the tyre&rsquo;s sidewall — the largest numbers on it.
            </p>
          </div>

          {/* Nothing in the range fits: hand the size straight to the enquiry form. */}
          {shown.length === 0 && (
            <div className="mx-auto mt-16 max-w-xl text-center">
              <p className="font-wide text-2xl font-extrabold uppercase leading-tight tracking-tight text-ink">
                No tyre in our list matches{sizing && <> <span className="text-brand">{size.trim()}</span></>}
              </p>
              <p className="mt-4 text-base leading-relaxed text-ash">
                BKT makes far more sizes than we show here. Send us the size and machine and we&rsquo;ll check
                what we can supply.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <WipeLink to={enquiryHref({ size: size.trim() })}>Ask about this size</WipeLink>
              </div>
              <button type="button" onClick={clearFinder} className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ash underline underline-offset-4 hover:text-brand">
                Clear the search
              </button>
            </div>
          )}

          {/* Grid — keyed on the sector so the cards replay their entrance. */}
          <ul
            id="range-grid"
            key={active}
            className="mt-14 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14"
          >
            {shown.slice(0, count).map(({ p, m }, i) => (
              <li key={p.slug} className="anim-rise [contain-intrinsic-size:auto_520px] [content-visibility:auto]" style={{ animationDelay: `${Math.min(i < FIRST ? i : (i - FIRST) % NEXT, 8) * 60}ms` }}>
                <ProductCard product={p} index={i} matches={m} sizeQuery={size.trim()} />
              </li>
            ))}
          </ul>

          {/* End-of-grid marker the scroll loading watches. */}
          {more && <div ref={sentinel} aria-hidden="true" className="h-px" />}

        </div>
      </section>

    </>
  )
}
