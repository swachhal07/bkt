import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/* BKT brand photography (client-supplied). */
import tyreLineup from '../assets/bkt-banner.webp' // product lineup on the road
import tractorField from '../assets/tractor-field.webp' // John Deere on BKT flotation tyres
import monsterTruck from '../assets/bkt-truck.webp' // BKT Monster Jam truck
import tyreDetail from '../assets/tyre-detail.webp' // macro tyre sidewall detail

const marqueeItems = [
  'Authorized BKT Distributor',
  'Genuine Products',
  'Nationwide Support',
  'Experienced Technical Assistance',
]

const categories = [
  {
    index: '01',
    kicker: 'Agriculture',
    name: 'Field & Farm',
    desc: 'Deep-lug traction that protects the soil and pulls through the season.',
    image: tractorField,
    pos: 'object-center',
  },
  {
    index: '02',
    kicker: 'On / Off Highway',
    name: 'Haul & Transport',
    desc: 'Built to carry heavy loads mile after mile, on the road and off it.',
    image: monsterTruck,
    pos: 'object-center',
  },
  {
    index: '03',
    kicker: 'Industrial & OTR',
    name: 'Site & Handling',
    desc: 'Cut-resistant compounds engineered for the hardest working ground.',
    image: tyreDetail,
    pos: 'object-left',
  },
]

const reasons = [
  {
    title: 'Genuine BKT, direct',
    desc: 'Sourced straight from the manufacturer. Never grey-market, never a fake.',
  },
  {
    title: 'Warranty on every tyre',
    desc: 'Full manufacturer warranty, honoured in full. Buy with total confidence.',
  },
  {
    title: 'Advice from real people',
    desc: 'Talk load ratings, tread and fitment with a team that actually knows tyres.',
  },
  {
    title: 'Fast, nationwide dispatch',
    desc: 'Stock moved quickly to your farm, depot, or job site, wherever you are.',
  },
]

const stats = [
  { value: '25+', label: 'Years in the trade' },
  { value: '300+', label: 'Sizes kept in stock' },
  { value: '48h', label: 'Typical dispatch time' },
  { value: '100%', label: 'Genuine BKT product' },
]

const faqs = [
  {
    q: 'Are these genuine BKT tyres?',
    a: 'Every tyre we sell is genuine BKT, sourced directly from the manufacturer — never grey-market, never a fake — and it carries the full manufacturer warranty.',
  },
  {
    q: 'Do you deliver nationwide?',
    a: 'Yes. We move stock quickly to your farm, depot, or job site wherever you are, with a typical dispatch time of around 48 hours.',
  },
  {
    q: 'Can you help me choose the right size?',
    a: 'Absolutely. Tell us the machine and the ground it works, and our team will talk you through load ratings, tread pattern, and fitment to match the right tyre.',
  },
  {
    q: 'What warranty comes with the tyres?',
    a: 'Every tyre is covered by the full BKT manufacturer warranty, honoured in full — so you can buy with total confidence.',
  },
  {
    q: 'Do you stock tubes and tubeless options?',
    a: 'We keep a broad range in stock across tube and tubeless fitments, in over 300 sizes. If we do not have your size on the shelf, we will source it fast.',
  },
]

const reviews = [
  {
    quote:
      'They matched us to the exact tyre for our fleet, had it on a pallet the same week, and answered every question without the runaround. That’s why we keep coming back.',
    name: 'Ram Maharjan',
    role: 'Fleet Manager, Himal Transport',
    initials: 'RM',
  },
  {
    quote:
      'The AGRIMAX tyres transformed how our tractors handle the wet season. Genuine BKT, fair pricing, and advice that was actually spot on.',
    name: 'Sita Gurung',
    role: 'Farm Owner, Chitwan',
    initials: 'SG',
  },
  {
    quote:
      'Cut-resistant compounds that hold up on our quarry floor day after day. Fast dispatch and no grey-market worries — exactly what we needed.',
    name: 'Bikash Thapa',
    role: 'Site Supervisor, Everest Aggregates',
    initials: 'BT',
  },
  {
    quote:
      'We run a mixed fleet and they sized every axle correctly the first time. Tyres arrived crated and ready — zero downtime for us.',
    name: 'Anita Shrestha',
    role: 'Operations Head, Pokhara Logistics',
    initials: 'AS',
  },
  {
    quote:
      'The tread life on these has outlasted anything we ran before. Honest advice, real stock, and a team that actually picks up the phone.',
    name: 'Deepak Rai',
    role: 'Contractor, Dharan Earthworks',
    initials: 'DR',
  },
  {
    quote:
      'Switched our whole orchard operation to BKT on their recommendation. Better grip in the mud and the pricing beat every quote we got.',
    name: 'Kamala Tamang',
    role: 'Farm Owner, Ilam',
    initials: 'KT',
  },
]


const pad = (n) => String(n + 1).padStart(2, '0')

/* Home's own section marker: a dot and a rule fading into the label on each
   side. `tone` picks the glow green for the dark sections, `align` centers it
   or lets it sit left. `className` is for per-instance nudges. */
const Kicker = ({ children, tone = 'dark', align = 'center', className = '' }) => {
  const light = tone === 'light'
  return (
    <div
      className={`flex items-center gap-4 ${
        align === 'center' ? 'justify-center' : ''
      } ${className}`}
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-brand-glow' : 'bg-brand'}`} />
        <span
          className={`h-px w-10 bg-gradient-to-r from-transparent ${
            light ? 'to-brand-glow' : 'to-brand'
          }`}
        />
      </span>
      <span
        className={`font-sans text-sm font-bold uppercase tracking-[0.25em] ${
          light ? 'text-brand-glow' : 'text-brand'
        }`}
      >
        {children}
      </span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span
          className={`h-px w-10 bg-gradient-to-l from-transparent ${
            light ? 'to-brand-glow' : 'to-brand'
          }`}
        />
        <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-brand-glow' : 'bg-brand'}`} />
      </span>
    </div>
  )
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)

  /* Reveal-on-scroll: toggle `.is-visible` as `.reveal` elements enter view.
     Content must never stay hidden — if IntersectionObserver never reports
     (some embedded webviews / preview panes don't run it), a failsafe reveals
     everything so the page is never stuck at opacity 0. */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (els.length === 0) return

    const revealAll = () => els.forEach((el) => el.classList.add('is-visible'))

    if (!('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    let ioFired = false
    const io = new IntersectionObserver(
      (entries) => {
        ioFired = true
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))

    const failsafe = setTimeout(() => {
      if (!ioFired) revealAll()
    }, 1600)

    return () => {
      io.disconnect()
      clearTimeout(failsafe)
    }
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-carbon text-white">
        <img
          src={tyreLineup}
          alt="The BKT AGRIMAX tyre range lined up on a country road through the fields"
          className="anim-fade absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform: 'scale(1.08) translateY(3%)' }}
          fetchPriority="high"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-carbon/85 via-carbon/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-carbon/85 via-carbon/30 to-transparent" />

        {/* Credentials rail — hairline-ruled ticker pinned to the hero's bottom edge.
            Items are duplicated once so the -50% marquee loops seamlessly; the second
            half is aria-hidden so the list is announced only once. */}
        <div className="marquee-pause absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/12 py-3.5 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
          <ul className="flex w-max animate-marquee-slow items-center">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <li
                key={i}
                aria-hidden={i >= marqueeItems.length}
                className="flex shrink-0 items-center"
              >
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 sm:text-xs">
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="mx-8 h-2.5 w-[2px] shrink-0 bg-brand-glow/80 sm:mx-12"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Our Range ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-12 pb-24 sm:pt-16 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="reveal">
              <Kicker>Our Range</Kicker>
            </div>
            <h2 className="reveal font-wide mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              A tyre for every
              <br />
              <span className="text-brand">terrain you work</span>
            </h2>
            <p className="reveal mx-auto mt-6 max-w-xl font-sans text-lg leading-relaxed text-ash">
              As an authorized BKT distributor, we supply the full range — from
              the field to the highway to the toughest job sites. Genuine
              product, backed by technical support you can reach.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.index}
                to="/products"
                className="reveal group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-steel"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <img
                  src={cat.image}
                  alt={`${cat.kicker} tyre application`}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 ${cat.pos}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent transition-opacity duration-500 group-hover:from-carbon" />

                <div className="relative z-10 p-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-glow">
                    {cat.kicker}
                  </span>
                  <h3 className="font-display mt-2 text-3xl font-bold uppercase leading-none text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-white/70">
                    {cat.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-white">
                    Explore
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>

                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="reveal mt-14 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1 font-sans text-base font-bold uppercase tracking-wide text-ink transition-colors hover:border-brand hover:text-brand"
            >
              View the full catalogue
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why BKT ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-carbon text-white">
        {/* Full-bleed tyre backdrop, echoing the hero's language */}
        <img
          src={tyreDetail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          loading="lazy"
        />
        {/* Scrim: even darken so centered copy stays readable */}
        <div className="absolute inset-0 bg-carbon/80" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-carbon to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-carbon via-carbon/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 text-center sm:px-6 sm:pt-20 sm:pb-32 lg:px-8">
          {/* Header, centered */}
          <div className="reveal mx-auto max-w-3xl">
            <Kicker tone="light">Why BKT</Kicker>
            <h2 className="font-wide mt-6 text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Genuine product,
              <br /> <span className="text-brand">people who back it</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-lg leading-relaxed text-white/70">
              Anyone can sell you a tyre. We make sure it&rsquo;s the right one,
              and we&rsquo;re here when it matters.
            </p>
          </div>

          {/* Reasons band, centered */}
          <ul className="mt-20 grid gap-x-32 gap-y-14 border-t border-white/15 pt-12 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason, i) => (
              <li
                key={reason.title}
                className="reveal group flex flex-col items-center"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="h-2.5 w-2.5 rotate-45 bg-brand-glow transition-transform duration-300 ease-out group-hover:scale-[1.6]" />
                <h3 className="font-display mt-5 whitespace-nowrap text-3xl font-bold uppercase leading-none transition-colors duration-300 group-hover:text-brand-glow">
                  {reason.title}
                </h3>
                <p className="mt-3 max-w-xs font-sans text-base leading-relaxed text-white/70">
                  {reason.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pb-24 pt-12 sm:pb-32 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="reveal">
              <Kicker>Reviews</Kicker>
            </div>
            <h2 className="reveal font-wide mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Trusted by the
              <br />
              <span className="text-brand">people who run BKT</span>
            </h2>
          </div>

        </div>

        {/* Review cards — auto-scrolling marquee, pauses on hover */}
        <div className="reveal marquee-pause relative mt-12 overflow-x-clip py-6 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          <ul className="flex w-max items-stretch animate-marquee">
            {[...reviews, ...reviews].map((review, i) => (
              <li
                key={i}
                aria-hidden={i >= reviews.length}
                className="mr-6 w-[340px] shrink-0 sm:w-[360px]"
              >
                <figure className="review-card flex h-full flex-col rounded-2xl border border-ink/10 bg-fog p-8 shadow-sm">
                  <div className="flex gap-1 text-brand">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.8L12 17.5 5.1 20.5l1.6-6.8L1.4 9.1l7-.6z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-6 flex-1">
                    <p className="font-sans text-lg leading-relaxed text-ink">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-ink/10 pt-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-white">
                      {review.initials}
                    </span>
                    <div>
                      <div className="font-sans font-bold text-ink">{review.name}</div>
                      <div className="font-sans text-sm text-ash">{review.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stats band (over field imagery) ───────────────────── */}
      <section className="relative overflow-hidden py-20 text-white sm:py-24">
        <img
          src={tractorField}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-carbon/85" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="reveal px-2 text-center lg:px-8"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-display text-6xl font-black leading-none text-brand-glow sm:text-7xl">
                  {stat.value}
                </div>
                <div className="mt-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip bg-white pb-24 pt-20 text-ink lg:pt-24">
        {/* Atmosphere: faint brand glow + a giant watermark index */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-8 h-[32rem] w-[32rem] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #007735 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
          {/* Left: heading + contact card, sticky on desktop. Pulled a little
              outside the container's gutter from `lg` up so the block sits
              closer to the page edge than the section padding allows. */}
          <div className="reveal self-start lg:sticky lg:top-28">
            <Kicker align="left" className="ml-4">
              FAQ
            </Kicker>
            <h2 className="font-wide mt-6 text-5xl font-bold uppercase leading-[0.88] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="line-mask">
                <span>Answers,</span>
              </span>
              <span className="line-mask">
                <span className="text-brand">straight up</span>
              </span>
            </h2>
            {/* Measure capped just above the column width, so from `lg` up the
                paragraph fills the same block the headline does — the two
                shared a left edge already but not a right one. */}
            <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-ash">
              Everything people ask us most about buying and running BKT tyres.
              Can&apos;t find yours? Our team is here to help.
            </p>

          </div>

          {/* Right: editorial numbered accordion — hairline rules, no cards */}
          <div className="reveal border-b border-ink/10">
            {faqs.map((faq, i) => {
              const open = openFaq === i
              return (
                <div
                  key={faq.q}
                  className={`group relative border-t border-ink/10 transition-colors duration-300 ${
                    open ? 'bg-brand/[0.04]' : 'hover:bg-fog'
                  }`}
                >
                  {/* animated green active bar */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-brand transition-transform duration-300 ease-out ${
                      open ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-5 py-6 pl-5 pr-4 text-left sm:gap-6 sm:pl-7"
                    >
                      <span
                        className={`font-display mt-0.5 text-3xl font-black tabular-nums leading-none transition-colors duration-300 sm:text-4xl ${
                          open ? 'text-brand' : 'text-ink/20 group-hover:text-ink/35'
                        }`}
                      >
                        {pad(i)}
                      </span>
                      <span
                        className={`flex-1 pt-1 font-display text-xl font-bold uppercase leading-tight tracking-tight transition-colors duration-300 sm:text-2xl ${
                          open ? 'text-brand' : 'text-ink'
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          open
                            ? 'rotate-180 border-brand bg-brand text-white'
                            : 'border-ink/15 text-ink group-hover:border-ink/40'
                        }`}
                        aria-hidden="true"
                      >
                        {/* horizontal bar (always) + vertical bar that collapses when open */}
                        <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
                        <span
                          className={`absolute h-3.5 w-[2px] rounded-full bg-current transition-transform duration-300 ${
                            open ? 'scale-y-0' : 'scale-y-100'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 pl-5 pr-10 font-sans text-base leading-relaxed text-ash sm:pl-[4.75rem]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
