import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TreadKicker from '../components/TreadKicker'
import { UPDATED, privacy, terms } from '../data/legal'

/* ────────────────────────────────────────────────────────────────────
   LEGAL — Privacy Policy (/privacy-policy) and Terms & Conditions (/terms).
   One layout for both, copy in src/data/legal.js.

     1  MASTHEAD    carbon, centred, plain — document switcher, title (last
                    word in glow green), intro, last-updated stamp
     2  AT A GLANCE three summary cards, straddling the carbon/white seam
     3  DOCUMENT    contents rail with reading progress and the current
                    section lit (sticky from lg; a disclosure on phones)
                    beside a 64ch measure of numbered sections
   ──────────────────────────────────────────────────────────────────── */

const DOCS = [privacy, terms]

const Chevron = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const Block = ({ block }) => {
  if (typeof block === 'string') {
    return <p className="mt-5 font-sans text-[17px] leading-[1.75] text-ink/75 first:mt-0">{block}</p>
  }
  if (block.list) {
    return (
      <ul className="mt-5 space-y-3 first:mt-0">
        {block.list.map((item) => (
          <li key={item} className="flex gap-3.5 font-sans text-[17px] leading-[1.65] text-ink/75">
            <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 shrink-0 bg-brand" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return null
}

/* Which section is being read, and how far down the document the reader is. */
function useReading(ids) {
  const [active, setActive] = useState(ids[0])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
      if (!els.length) return
      const line = window.innerHeight * 0.3
      let current = els[0].id
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id
      setActive(current)

      const first = els[0].getBoundingClientRect().top + window.scrollY
      const last = els[els.length - 1]
      const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
      const p = (window.scrollY - first + line) / Math.max(1, end - first + line)
      setProgress(Math.min(1, Math.max(0, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids.join()]) // eslint-disable-line react-hooks/exhaustive-deps -- string key: the array is rebuilt every render

  return { active, progress }
}

function Contents({ doc, active, progress }) {
  return (
    <ol className="space-y-0.5">
      {doc.sections.map((s, i) => {
        const on = s.id === active
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={on ? 'true' : undefined}
              className={`group relative flex items-baseline gap-4 py-2 pl-4 font-sans text-[15px] transition-colors ${
                on ? 'text-brand' : 'text-ash hover:text-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-1.5 left-0 w-[2px] transition-colors ${on ? 'bg-brand' : 'bg-transparent'}`}
              />
              <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className={on ? 'font-medium' : ''}>{s.title}</span>
            </a>
          </li>
        )
      })}
      <li aria-hidden="true" className="pt-5">
        <div className="h-[3px] w-full bg-ink/8">
          <div className="h-full origin-left bg-brand transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
          {Math.round(progress * 100)}% read
        </span>
      </li>
    </ol>
  )
}

function LegalPage({ doc }) {
  const ids = doc.sections.map((s) => s.id)
  const { active, progress } = useReading(ids)
  const words = doc.title.split(' ')
  const lead = words.slice(0, -1).join(' ')
  const tail = words[words.length - 1]

  useEffect(() => {
    const prev = document.title
    document.title = `${doc.title} — BKT Tyres Nepal`
    return () => {
      document.title = prev
    }
  }, [doc.title])

  return (
    <>
      {/* ══ 1 · MASTHEAD ═════════════════════════════════════════════ */}
      <header className="relative overflow-hidden bg-carbon text-white">
        <div className="relative mx-auto flex max-w-[100rem] flex-col items-center px-4 pb-36 pt-12 text-center sm:px-6 sm:pb-44 sm:pt-16 lg:px-10">
          {/* Document switcher */}
          <nav aria-label="Legal documents" className="anim-rise inline-flex border border-white/15 p-1">
            {DOCS.map((d) => {
              const on = d.slug === doc.slug
              return (
                <Link
                  key={d.slug}
                  to={`/${d.slug}`}
                  aria-current={on ? 'page' : undefined}
                  className={`px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] transition-colors sm:px-5 sm:text-[11px] ${
                    on ? 'bg-brand text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {d.title}
                </Link>
              )
            })}
          </nav>

          <div className="anim-rise mt-14" style={{ animationDelay: '60ms' }}>
            <TreadKicker onDark>{doc.kicker}</TreadKicker>
          </div>
          <h1
            className="font-wide anim-rise mt-6 text-[clamp(2.6rem,7.5vw,6.25rem)] font-extrabold uppercase leading-[0.88] tracking-tight"
            style={{ animationDelay: '120ms' }}
          >
            {lead && <span className="block">{lead}</span>}
            <span className="block text-brand-glow">{tail}</span>
          </h1>
          <p
            className="anim-rise mt-8 max-w-[56ch] font-sans text-base leading-relaxed text-white/65 sm:text-lg"
            style={{ animationDelay: '220ms' }}
          >
            {doc.intro}
          </p>
          <p className="anim-rise mt-6 font-mono text-[10px] uppercase tracking-[0.26em] text-white/45" style={{ animationDelay: '260ms' }}>
            Last updated <span className="ml-1 text-white">{UPDATED}</span>
          </p>
        </div>
      </header>

      {/* ══ 2 · AT A GLANCE ══════════════════════════════════════════ */}
      <div className="relative mx-auto -mt-24 max-w-[100rem] px-4 sm:-mt-28 sm:px-6 lg:px-10">
        {/* Solid white panel with one green top edge; dividers are borders on
            white, so nothing of the carbon masthead shows through them. */}
        <ul className="anim-rise grid border-t-[3px] border-brand bg-white shadow-[0_24px_60px_-28px_rgba(12,13,15,0.35)] md:grid-cols-3" style={{ animationDelay: '320ms' }}>
          {doc.highlights.map((h, i) => (
            <li
              key={h.title}
              className="border-[#e4e6e9] p-6 sm:p-8 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ash">
                At a glance · {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-wide mt-3 text-lg font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-xl">
                {h.title}
              </h2>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-ash">{h.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ══ 3 · DOCUMENT ═════════════════════════════════════════════ */}
      <div className="mx-auto max-w-[100rem] px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-20 lg:px-10">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            {/* Phones/tablets: folded away so the text comes first. */}
            <details className="group border-y border-ink/12 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-ink [&::-webkit-details-marker]:hidden">
                Contents · {doc.sections.length} sections
                <Chevron className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-5">
                <Contents doc={doc} active={active} progress={progress} />
              </div>
            </details>
            <nav aria-label="Contents" className="hidden lg:sticky lg:top-32 lg:block">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">Contents</span>
              <div className="mt-4">
                <Contents doc={doc} active={active} progress={progress} />
              </div>
            </nav>
          </aside>

          <article className="max-w-[66ch] lg:col-span-8 xl:col-span-7 xl:col-start-5">
            {doc.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-32 border-t border-ink/10 py-10 first:border-t-0 first:pt-0 sm:py-12"
              >
                <div className="flex items-start gap-5 sm:gap-7">
                  <span
                    aria-hidden="true"
                    className="font-wide -mt-1 shrink-0 text-[2.5rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-brand)] sm:text-[3.25rem]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-wide text-[clamp(1.35rem,2.2vw,1.85rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-brand">
                      {s.title}
                    </h2>
                    <div className="mt-5">
                      {s.body.map((b, j) => (
                        <Block key={j} block={b} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  )
}

export const PrivacyPolicy = () => <LegalPage doc={privacy} />
export const Terms = () => <LegalPage doc={terms} />
