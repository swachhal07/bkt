import { useSearchParams } from 'react-router-dom'
import { products, sectors, productBySlug } from '../data/products'
import { Kicker, WipeLink, ProductCard, useReveal } from '../components/productUi'

/* ────────────────────────────────────────────────────────────────────
   PRODUCTS — the BKT range we supply.

     1  HERO     white split: headline left, three tyres standing on a
                 skewed brand slab right
     2  RANGE    fog — sector switcher (synced to ?sector=) over a grid of
                 tyre cards; each card opens /products/:slug
   ──────────────────────────────────────────────────────────────────── */

/* Hero lineup: back-left, back-right, front-centre. */
const lineup = [
  { p: productBySlug('earthmax-sr-45-m'), cls: 'left-0 bottom-[11%] h-[64%] -rotate-[5deg]', delay: 260 },
  { p: productBySlug('xl-grip-l3'), cls: 'right-0 bottom-[11%] h-[60%] rotate-[6deg]', delay: 360 },
  { p: productBySlug('agrimax-force'), cls: 'left-1/2 -translate-x-1/2 bottom-[7%] h-[90%]', delay: 160 },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const active = sectors.some((s) => s.id === params.get('sector')) ? params.get('sector') : 'all'
  const shown = active === 'all' ? products : products.filter((p) => p.sector === active)
  const activeSector = sectors.find((s) => s.id === active)

  useReveal('products')

  const pick = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('sector')
    else next.set('sector', id)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const tabs = [
    { id: 'all', name: 'All tyres', count: products.length },
    ...sectors.map((s) => ({ id: s.id, name: s.name, count: products.filter((p) => p.sector === s.id).length })),
  ]

  return (
    <>
      {/* ══ 1 · HERO ═════════════════════════════════════════════════ */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-[100rem] flex-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:py-16">
          <div className="lg:col-span-6">
            <div className="anim-rise">
              <Kicker align="left">Products</Kicker>
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
              className="anim-rise mt-8 max-w-[50ch] text-base leading-relaxed text-ash sm:text-lg text-pretty"
              style={{ animationDelay: '420ms' }}
            >
              The BKT range we supply across Nepal — agricultural, industrial and
              off-the-road tyres, each with its full size table and a 3D model you
              can turn and inspect before you buy.
            </p>
            <div className="anim-rise mt-10 flex flex-wrap gap-4" style={{ animationDelay: '520ms' }}>
              <WipeLink href="#range">Browse the range</WipeLink>
              <WipeLink to="/contact">Ask for a size</WipeLink>
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
              className="mt-6 font-wide text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-brand"
            >
              Pick your ground
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-ash sm:text-lg">
              {activeSector
                ? activeSector.lede
                : 'Three sectors, one standard. Choose where your machine works, then open any tyre for sizes, specs and its 3D model.'}
            </p>
          </div>

          {/* Sector switcher */}
          <div className="reveal mt-12 flex justify-center">
            <div
              role="tablist"
              aria-label="Filter tyres by sector"
              className="flex max-w-full flex-wrap justify-center gap-1.5 rounded-3xl border border-ink/12 bg-white p-1.5 sm:gap-2 sm:rounded-full"
            >
              {tabs.map((t) => {
                const on = t.id === active
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="range-grid"
                    onClick={() => pick(t.id)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 sm:px-5 ${
                      on ? 'bg-brand text-white' : 'text-ink hover:bg-ink/[0.05]'
                    }`}
                  >
                    {t.name}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                        on ? 'bg-white/20 text-white' : 'bg-ink/[0.06] text-ash'
                      }`}
                    >
                      {t.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid — keyed on the sector so the cards replay their entrance. */}
          <ul
            id="range-grid"
            key={active}
            className="mt-16 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14"
          >
            {shown.map((p, i) => (
              <li key={p.slug} className="anim-rise" style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
                <ProductCard product={p} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  )
}
