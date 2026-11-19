import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productBySlug, relatedTo, sketchfabSrc, rangeGroups } from '../data/products'
import { Kicker, WipeLink, ProductCard, useReveal } from '../components/productUi'
import NotFound from './NotFound'
import { FeatureNut } from '../components/featureGlyphs'

/* ────────────────────────────────────────────────────────────────────
   TYRE DETAIL — /products/:slug

     1  HERO       white split: stage (photo ⇄ live 3D model) left, name,
                   description, machines/applications and enquiry right
     2  FEATURES   fog — wheel-nut icon grid
     3  SIZES      white — searchable size table
     4  FILM       carbon — BKT's video for the pattern, where one exists
     5  MORE       white — the rest of the sector
   ──────────────────────────────────────────────────────────────────── */

const Cube = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" />
    <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
  </svg>
)

/* Photo ⇄ 3D. The Sketchfab embed only loads once 3D is chosen, so the page
   stays light for anyone who doesn't ask for it. */
function Stage({ p }) {
  const [mode, setMode] = useState('photo')
  const [loaded, setLoaded] = useState(false)
  const is3d = mode === '3d'

  return (
    <div className="relative aspect-square overflow-hidden rounded-3xl bg-fog sm:aspect-[5/4] lg:aspect-auto lg:h-full">
      {/* Photo */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${is3d ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        aria-hidden={is3d}
      >
        <span
          aria-hidden="true"
          className="prod-stage-slab absolute inset-x-[22%] bottom-0 h-[82%] rounded-[2.4rem_0.6rem_2.4rem_0.6rem] bg-brand"
          style={{ '--slab-y': '14%' }}
        />
        <img
          key={p.slug}
          src={p.image}
          alt={`${p.name} tyre`}
          className="anim-rise absolute inset-0 m-auto h-[84%] w-auto max-w-[80%] object-contain drop-shadow-[0_28px_30px_rgb(12_13_15/0.28)]"
          style={{ animationDelay: '150ms' }}
        />
      </div>

      {/* 3D */}
      {is3d && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#ffffff_0%,#eceef0_70%)]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ash">
              <Cube className="h-8 w-8 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Loading 3D model…</span>
            </div>
          )}
          <iframe
            key={p.model}
            title={`${p.name} 3D model`}
            src={sketchfabSrc(p.model)}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Bottom-right: Sketchfab pins its logo badge bottom-left inside the embed. */}
          <p className="pointer-events-none absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
            Drag to rotate · Scroll to zoom
          </p>
        </div>
      )}

      {/* Toggle — only when BKT publishes a 3D model for this pattern */}
      {p.model && (
      <div
        role="group"
        aria-label="View"
        className="absolute right-4 top-4 flex rounded-full border border-ink/12 bg-white/90 p-1 backdrop-blur"
      >
        {[
          { id: 'photo', label: 'Photo' },
          { id: '3d', label: '3D model' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
              mode === m.id ? 'bg-brand text-white' : 'text-ink hover:bg-ink/[0.05]'
            }`}
          >
            {m.id === '3d' && <Cube className="h-3.5 w-3.5" />}
            {m.label}
          </button>
        ))}
      </div>
      )}
    </div>
  )
}

function SizeTable({ p }) {
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/\s+/g, '')
    if (!t) return p.sizes
    return p.sizes.filter((s) => `${s.size}${s.version}${s.rim}`.toLowerCase().replace(/\s+/g, '').includes(t))
  }, [q, p.sizes])

  return (
    <>
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
        <label className="block w-full">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Search sizes</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. 650/65 R 38"
            className="mt-2 w-full border-b border-ink/25 bg-transparent py-2.5 text-center font-mono text-sm text-ink outline-none placeholder:text-ash/60 focus:border-brand"
          />
        </label>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash" aria-live="polite">
          Showing {rows.length} of {p.sizes.length}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/20">
              {['Size', 'Version', 'Load index / speed', 'Rim (rec.)', 'Outer Ø (mm)'].map((h) => (
                <th key={h} scope="col" className="py-3 pr-6 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ash">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={i} className="border-b border-ink/10 transition-colors hover:bg-mist">
                <th scope="row" className="py-3.5 pr-6 font-wide text-sm font-bold uppercase tracking-tight text-ink">
                  {s.size}
                </th>
                <td className="py-3.5 pr-6 font-mono text-xs uppercase tracking-[0.06em] text-ash">{s.version || '—'}</td>
                <td className="py-3.5 pr-6 font-mono text-xs text-ink">{s.load || '—'}</td>
                <td className="py-3.5 pr-6 font-mono text-xs text-ink">{s.rim || '—'}</td>
                <td className="py-3.5 pr-6 font-mono text-xs tabular-nums text-ink">{s.od || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-ash">
                  No size matches “{q}”. Try fewer characters, or ask our team.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* Long BKT descriptions clamp to five lines with a toggle. */
function Blurb({ text }) {
  const [more, setMore] = useState(false)
  const long = text.length > 340
  return (
    <div className="anim-rise mt-5" style={{ animationDelay: '240ms' }}>
      <p className={`text-base leading-relaxed text-ash sm:text-lg text-pretty ${long && !more ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-brand underline-offset-4 hover:underline"
        >
          {more ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

/* BKT's film for this pattern. A poster frame (YouTube's own thumbnail) on
   a skewed brand slab; the YouTube player only loads when Play is pressed,
   from youtube-nocookie.com, so the page stays light and cookie-free until
   someone asks for the video. */
function Film({ video, name }) {
  const [play, setPlay] = useState(false)
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`)
  const [series, title] = video.title.includes(' | ') ? video.title.split(' | ') : ['BKT', video.title]

  return (
    <section aria-labelledby="film-title" className="overflow-hidden bg-carbon py-24 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="reveal grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Kicker tone="dark" align="left">Watch it work</Kicker>
            <h2
              id="film-title"
              className="mt-6 font-wide text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-brand"
            >
              See it in action
            </h2>
          </div>
          <p className="max-w-[44ch] text-base leading-relaxed text-white/65 sm:text-lg lg:col-span-5">
            The {name} at work, filmed by BKT — tread, casing and the job it was built for.
          </p>
        </div>

        <div className="reveal relative mt-12 sm:mt-14">
          <span
            aria-hidden="true"
            className="absolute -bottom-5 -right-3 h-3/4 w-2/3 -skew-x-[9deg] rounded-[2.4rem_0.6rem_2.4rem_0.6rem] bg-brand sm:-bottom-8 sm:-right-6"
          />
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-steel ring-1 ring-white/10">
            {play ? (
              <iframe
                title={`${title} — video`}
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlay(true)}
                aria-label={`Play video: ${title}`}
                className="group absolute inset-0 h-full w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-brand-glow"
              >
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  onError={() => setPoster(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-carbon/85 via-carbon/20 to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 ease-out group-hover:scale-110 sm:h-24 sm:w-24">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1 h-8 w-8 sm:h-9 sm:w-9">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-8">
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brand-glow">{series}</span>
                    <span className="mt-2 block font-wide text-lg font-bold uppercase leading-tight tracking-tight text-white sm:text-2xl">
                      {title}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">Play film</span>
                </span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Video · BKT Tires on YouTube</p>
      </div>
    </section>
  )
}

const otrGroupName = (id) => rangeGroups.find((g) => g.id === id)?.name ?? id

export default function ProductDetail() {
  const { slug } = useParams()
  const p = productBySlug(slug)
  useReveal(slug)

  if (!p) return <NotFound />

  const siblings = relatedTo(p)

  return (
    <div key={p.slug}>
      {/* ══ 1 · HERO ═════════════════════════════════════════════════
          Sized to one screen on desktop: the stage takes the viewport height
          that's left under the nav and breadcrumb, and the details below the
          description sit in a 2×2 grid so the enquiry buttons stay in view. */}
      <section className="bg-white lg:flex lg:min-h-[calc(100svh-6rem)] lg:flex-col">
        <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          <nav aria-label="Breadcrumb" className="anim-rise font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
            <Link to="/products" className="hover:text-brand">Products</Link>
            <span className="mx-2 text-ink/25">/</span>
            <Link to={`/products?sector=${p.sector}#range`} className="hover:text-brand">{p.sectorName}</Link>
            <span className="mx-2 text-ink/25">/</span>
            <span className="text-ink">{p.name}</span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-16">
            <div className="anim-rise lg:col-span-6 lg:h-[min(calc(100svh-17rem),40rem)]">
              <Stage p={p} />
            </div>

            <div className="@container lg:col-span-6">
              <div>
              <p className="anim-rise font-mono text-xs uppercase tracking-[0.2em] text-brand">
                {p.sectorName} tyre
              </p>
              {/* One line, always: the size is worked out from the column width
                  and the name's length, so long names shrink instead of wrapping. */}
              <h1
                className="anim-rise mt-3 whitespace-nowrap font-wide font-extrabold uppercase leading-[0.95] tracking-tight text-ink"
                style={{
                  animationDelay: '80ms',
                  fontSize: `min(4.25rem, calc(100cqi / ${(p.name.length * 0.66).toFixed(2)}))`,
                }}
              >
                {p.name}
              </h1>

              <div className="anim-rise mt-4 flex flex-wrap gap-2" style={{ animationDelay: '160ms' }}>
                {[p.construction, p.range].filter(Boolean).map((t) => (
                  <span key={t} className="rounded-full border border-ink/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                    {t}
                  </span>
                ))}
                {p.isNew && (
                  <span className="rounded-full bg-brand-glow px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                    New pattern
                  </span>
                )}
              </div>

              <Blurb key={p.slug} text={p.text} />
              </div>

              <div className="mt-6">
              <dl
                className="anim-rise grid grid-cols-2 border-t border-ink/12"
                style={{ animationDelay: '320ms' }}
              >
                {[
                  { k: 'Machines', v: p.machines.join(', ') },
                  { k: 'Applications', v: p.applications.join(', ') },
                  { k: 'Construction', v: p.construction },
                  { k: 'Sizes', v: `${p.sizeCount} ${p.sizeCount === 1 ? 'size' : 'sizes'} listed` },
                ].map((r, i) => (
                  <div key={r.k} className={`border-b border-ink/12 py-3 ${i % 2 === 0 ? 'pr-5' : 'border-l pl-5'}`}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">{r.k}</dt>
                    <dd className="mt-1.5 text-sm font-medium text-ink">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="anim-rise mt-6 flex flex-wrap gap-4" style={{ animationDelay: '400ms' }}>
                <WipeLink to="/contact">Enquire about this tyre</WipeLink>
                <WipeLink href="#sizes">See all sizes</WipeLink>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2 · FEATURES ═════════════════════════════════════════════
          Fog band, centred heading, one wheel-nut icon (our own glyphs,
          featureGlyphs.jsx) above each feature name, four to a row. */}
      <section aria-labelledby="features-title" className="bg-fog py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="reveal text-center">
            <Kicker>Features</Kicker>
            <h2
              id="features-title"
              className="mt-5 font-wide text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink"
            >
              Built to do
            </h2>
          </div>
          <ul className="reveal mt-14 flex flex-wrap justify-center gap-y-12">
            {p.features.map((f) => (
              <li key={f} className="feat-item flex w-1/2 flex-col items-center px-4 text-center sm:w-1/3 lg:w-1/4">
                <FeatureNut name={f} size="5rem" glyph="h-9 w-9" />
                <p className="feat-label mt-4 font-wide text-sm font-bold uppercase leading-snug tracking-tight text-ink sm:text-base">
                  {f}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 3 · SIZES ════════════════════════════════════════════════ */}
      <section id="sizes" aria-labelledby="sizes-title" className="scroll-mt-24 bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
          <div className="reveal mx-auto max-w-3xl text-center">
            <Kicker>Technical data</Kicker>
            <h2
              id="sizes-title"
              className="mt-6 font-wide text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink"
            >
              Sizes &amp; specs
            </h2>
          </div>
          {/* Sizes stocked in Nepal, as listed in the client's OTR range PDF
              (ply rating included where the PDF gives one). */}
          {p.stock.length > 0 && (
            <div className="reveal mx-auto mt-10 max-w-4xl text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                Stocked in Nepal{p.groups.length > 0 && <> · {p.groups.map((g) => otrGroupName(g)).join(' · ')}</>}
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {p.stock.map((s) => (
                  <li key={s} className="rounded-full bg-mist px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.04em] text-brand">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="reveal mt-12">
            <SizeTable p={p} />
          </div>
          <p className="mx-auto mt-8 max-w-[70ch] text-center text-xs leading-relaxed text-ash">
            Specifications as published by BKT. Always confirm fitment and load
            requirements with our team or your equipment manufacturer before ordering.
          </p>
        </div>
      </section>

      {/* ══ 4 · FILM — only for the patterns BKT has a video for ═════ */}
      {p.video && <Film video={p.video} name={p.name} />}

      {/* ══ 5 · MORE ═════════════════════════════════════════════════ */}
      {siblings.length > 0 && (
        <section aria-labelledby="more-title" className="border-t border-ink/25 bg-white py-24 sm:py-28">
          <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
            <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Kicker align="left">{p.sectorName}</Kicker>
                <h2
                  id="more-title"
                  className="mt-6 font-wide text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink"
                >
                  More for the job
                </h2>
              </div>
              <WipeLink to={`/products?sector=${p.sector}#range`}>All {p.sectorName}</WipeLink>
            </div>
            <ul className="reveal mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-10 xl:grid-cols-4">
              {siblings.map((s, i) => (
                <li key={s.slug}>
                  <ProductCard product={s} index={i} tile="bg-fog" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
