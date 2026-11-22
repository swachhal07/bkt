import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import TreadKicker from '../components/TreadKicker'
import motiLalDugarImg from '../assets/af0b8ecf-4ddc-41f9-9dd1-ba5c0df1b212.webp'
import vivekDugarImg from '../assets/ae68fbad-4028-45aa-81d5-44d526f4f5af.webp'
import shubhamDugarImg from '../assets/af5ea000-e8c5-4f03-ac64-9fd3a8bb8009.webp'
import namanDugarImg from '../assets/eb7eb529-8d15-4359-8ac0-df51b7393d00.webp'

/* ────────────────────────────────────────────────────────────────────
   LEADERSHIP — Board of Directors and Management Team.

     1  HERO         white, centred, type only — same masthead spec as About
                     and Blog (one screen, two wipe buttons, ruled facts rail)
     2  BOARD        carbon — four portrait cards
     3  MANAGEMENT   white — business head centred on top, four cards below
   ──────────────────────────────────────────────────────────────────── */

const board = [
  {
    name: 'Moti Lal Dugar',
    role: 'Chairman',
    photo: motiLalDugarImg,
    bio: 'Leads the board and sets the long-term vision of the MV Dugar Group, stewarding a multi-generational legacy across Nepal.',
  },
  {
    name: 'Vivek Dugar',
    role: 'Vice Chairman',
    photo: vivekDugarImg,
    bio: 'Drives the group’s strategic direction, automotive partnerships, and national distribution across Nepal.',
  },
  {
    name: 'Shubham Dugar',
    role: 'Director',
    photo: shubhamDugarImg,
    bio: 'Oversees portfolio expansion, strategic operations, and brand partnerships connecting global leaders with local markets.',
  },
  {
    name: 'Naman Dugar',
    role: 'Director',
    photo: namanDugarImg,
    bio: 'Guides commercial growth, operational excellence, and distribution networks across the group’s ventures.',
  },
]

const management = [
  { name: 'Nabin Parajuli', role: 'Business Head' },
  { name: 'Bibek Gupta', role: 'Sales Head — OTR Division' },
  { name: 'Keshabraj Pudasaini', role: 'Sales Head — Agri Division' },
  { name: 'Sunny Passawn', role: 'Finance Head' },
  { name: 'Munna Miya Dhuniya', role: 'Service Manager' },
]

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/* Same button as About: translucent fill, green panel wipes in on hover.
   `href` renders a plain anchor, for in-page jumps to a section. */
const WipeLink = ({ to, href, children }) => {
  const Tag = href ? 'a' : Link
  const target = href ? { href } : { to }
  return (
  <Tag
    {...target}
    className="group relative inline-flex items-center gap-3 overflow-hidden border border-ink/20 bg-ink/[0.02] px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
  >
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
    />
    <span className="relative">{children}</span>
    <Arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
  </Tag>
  )
}

/* Ruled along the foot of the hero, as on About and Blog. */
const facts = [
  { label: 'Board', value: '4 Directors' },
  { label: 'Management', value: `${management.length} Leaders` },
  { label: 'Group', value: 'MV Dugar Group' },
  { label: 'Based', value: 'Kathmandu, Nepal' },
]

const Kicker = ({ children, tone = 'light' }) => (
  <TreadKicker onDark={tone === 'dark'}>{children}</TreadKicker>
)

/* Portrait card. On hover the photo frame leans into a skewed slab — motion
   lives in index.css under "Leadership portrait card: skewed slab". */
function PersonCard({ person, index, tone }) {
  const onDark = tone === 'dark'

  return (
    <li className="reveal" style={{ transitionDelay: `${index * 90}ms` }}>
      <div className="pcard block w-full text-left">
        <div
          className={`pcard-frame relative aspect-[4/5] overflow-hidden ${
            onDark ? 'bg-steel' : 'bg-fog'
          }`}
        >
          {person.photo ? (
            <img
              src={person.photo}
              alt={`${person.name}, ${person.role}`}
              className="pcard-img absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`pcard-img absolute inset-0 flex items-center justify-center font-wide text-[clamp(4rem,9vw,7rem)] font-extrabold tracking-tight ${
                onDark ? 'text-white/10' : 'text-ink/[0.07]'
              }`}
            >
              {initials(person.name)}
            </span>
          )}

          {/* Index tag, top-left */}
          <span
            className={`absolute left-4 top-4 font-mono text-[11px] tabular-nums tracking-[0.18em] ${
              onDark ? 'text-white/45' : 'text-ash'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className={`pcard-meta mt-5 border-t pt-4 ${onDark ? 'border-white/15' : 'border-ink/12'}`}>
          <h3
            className={`font-wide text-xl font-bold uppercase leading-tight tracking-tight sm:text-2xl ${
              onDark ? 'text-white' : 'text-ink'
            }`}
          >
            {person.name}
          </h3>
          <p
            className={`mt-1.5 font-mono text-xs uppercase tracking-[0.16em] ${
              onDark ? 'text-brand-glow' : 'text-brand'
            }`}
          >
            {person.role}
          </p>
        </div>
      </div>
    </li>
  )
}

function TeamSection({ id, kicker, title, lede, people, tone, leadFirst = false }) {
  const onDark = tone === 'dark'
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`py-24 sm:py-32 ${onDark ? 'bg-carbon text-white' : 'bg-white text-ink'}`}
    >
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <div className="reveal mx-auto max-w-3xl text-center">
          <Kicker tone={tone}>{kicker}</Kicker>
          <h2
            id={`${id}-title`}
            className="mt-6 font-wide text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-brand"
          >
            {title}
          </h2>
          <p className={`mx-auto mt-6 max-w-[52ch] text-base leading-relaxed sm:text-lg ${onDark ? 'text-white/65' : 'text-ash'}`}>
            {lede}
          </p>
        </div>

        {/* With `leadFirst`, the first person heads the team: a card of the
            same column width, centred on its own row above the rest. */}
        {leadFirst && (
          <ul className="mx-auto mt-16 w-full sm:mt-20 sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-9rem)/4)]">
            <PersonCard person={people[0]} index={0} tone={tone} />
          </ul>
        )}

        <ul
          className={`grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12 ${
            leadFirst ? 'mt-14 sm:mt-16' : 'mt-16 sm:mt-20'
          }`}
        >
          {(leadFirst ? people.slice(1) : people).map((p, i) => {
            const index = leadFirst ? i + 1 : i
            return <PersonCard key={`${p.role}-${index}`} person={p} index={index} tone={tone} />
          })}
        </ul>
      </div>
    </section>
  )
}

export default function Leadership() {
  /* Reveal-on-scroll, same as About: visible unless the observer runs, with
     a failsafe if it never reports. */
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
      {/* ══ 1 · HERO ═════════════════════════════════════════════════ */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col bg-white">
        <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
          <div className="anim-rise">
            <Kicker>Leadership</Kicker>
          </div>
          <h1 className="font-wide anim-lines mt-8 text-[clamp(2.5rem,min(8.5vw,12vh),6rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink">
            <span className="line-mask">
              <span>The team</span>
            </span>
            <span className="line-mask">
              <span>steering</span>
            </span>
            <span className="line-mask">
              <span className="text-brand">every mile.</span>
            </span>
          </h1>
          <p
            className="anim-rise mt-8 max-w-[54ch] font-sans text-base leading-relaxed text-ash sm:text-lg text-pretty"
            style={{ animationDelay: '420ms' }}
          >
            Our board sets the direction; our management team delivers it — so
            genuine BKT tyres reach the farm, the site and the road across Nepal.
          </p>
          <div
            className="anim-rise mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: '520ms' }}
          >
            <WipeLink href="#board">Board of Directors</WipeLink>
            <WipeLink href="#management">Management Team</WipeLink>
          </div>
        </div>

        {/* Facts rail — same spec as the About and Blog mastheads. */}
        <div
          className="anim-rise hidden border-y border-ink/12 sm:block"
          style={{ animationDelay: '620ms' }}
        >
          <dl className="mx-auto grid max-w-[100rem] grid-cols-2 divide-ink/10 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-10">
            {facts.map((f) => (
              <div key={f.label} className="py-5 text-center lg:px-8 lg:py-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
                  {f.label}
                </dt>
                <dd className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink sm:text-[13px]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ 2 · BOARD ════════════════════════════════════════════════ */}
      <TeamSection
        id="board"
        tone="dark"
        kicker="Governance"
        title="Board of Directors"
        lede="The board guides the company’s strategy and holds it to the standards of the MV Dugar Group."
        people={board}
      />

      {/* ══ 3 · MANAGEMENT ═══════════════════════════════════════════ */}
      <TeamSection
        id="management"
        tone="light"
        kicker="Operations"
        title="Management Team"
        lede="The people who run the business day to day — from the warehouse floor to the dealer’s counter."
        people={management}
        leadFirst
      />
    </>
  )
}
