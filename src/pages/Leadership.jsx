import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/* ────────────────────────────────────────────────────────────────────
   LEADERSHIP — Board of Directors and Management Team.

     1  HERO         white, centred, type only — same masthead spec as About
                     and Blog (one screen, two wipe buttons, ruled facts rail)
     2  BOARD        carbon — four portrait cards
     3  MANAGEMENT   white — four portrait cards, same card, light tone
     4  CLOSE        one line and a route to Contact

   NOTE: every name, title and bio below is a PLACEHOLDER. Swap in the
   client's real people, and drop a `photo` import onto each entry when
   portraits arrive — until then the card shows the person's initials on a
   brand slab rather than a stock face standing in for a real person.
   ──────────────────────────────────────────────────────────────────── */

const board = [
  {
    name: 'Director Name',
    role: 'Chairman',
    bio: 'Leads the board and sets the long-term direction of the business within the MV Dugar Group.',
  },
  {
    name: 'Director Name',
    role: 'Managing Director',
    bio: 'Responsible for the company’s strategy, partnerships and growth across Nepal.',
  },
  {
    name: 'Director Name',
    role: 'Director',
    bio: 'Oversees finance and governance, keeping the business accountable to its partners.',
  },
  {
    name: 'Director Name',
    role: 'Director',
    bio: 'Brings experience in distribution and supply, guiding how stock reaches every region.',
  },
]

const management = [
  {
    name: 'Manager Name',
    role: 'Chief Executive Officer',
    bio: 'Runs day-to-day operations and turns the board’s direction into delivery.',
  },
  {
    name: 'Manager Name',
    role: 'Head of Sales',
    bio: 'Leads the dealer network and the teams who match each customer to the right tyre.',
  },
  {
    name: 'Manager Name',
    role: 'Head of Operations',
    bio: 'Owns warehousing and dispatch, so genuine stock is where it needs to be on time.',
  },
  {
    name: 'Manager Name',
    role: 'Head of Finance',
    bio: 'Manages accounts, credit and reporting across the business.',
  },
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
  { label: 'Management', value: '4 Leaders' },
  { label: 'Group', value: 'MV Dugar Group' },
  { label: 'Based', value: 'Kathmandu, Nepal' },
]

const Kicker = ({ children, tone = 'light' }) => {
  const c = tone === 'dark' ? 'bg-brand-glow' : 'bg-brand'
  const from = tone === 'dark' ? 'to-brand-glow' : 'to-brand'
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className={`h-1.5 w-1.5 rounded-full ${c}`} />
        <span className={`h-px w-10 bg-gradient-to-r from-transparent ${from}`} />
      </span>
      <span className={`font-sans text-sm font-bold uppercase tracking-[0.25em] ${tone === 'dark' ? 'text-brand-glow' : 'text-brand'}`}>
        {children}
      </span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className={`h-px w-10 bg-gradient-to-l from-transparent ${from}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${c}`} />
      </span>
    </div>
  )
}

/* Portrait card. The bio sits on a brand-green panel that rises from the
   foot of the portrait on hover or keyboard focus; on touch, a tap toggles
   it. Below the portrait, name and role are always visible so nothing
   depends on hovering. */
function PersonCard({ person, index, tone }) {
  const [open, setOpen] = useState(false)
  const onDark = tone === 'dark'

  return (
    <li className="reveal" style={{ transitionDelay: `${index * 90}ms` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
          onDark ? 'focus-visible:outline-brand-glow' : 'focus-visible:outline-brand'
        }`}
      >
        <div
          className={`relative aspect-[4/5] overflow-hidden ${
            onDark ? 'bg-steel' : 'bg-fog'
          }`}
        >
          {person.photo ? (
            <img
              src={person.photo}
              alt={`${person.name}, ${person.role}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`absolute inset-0 flex items-center justify-center font-wide text-[clamp(4rem,9vw,7rem)] font-extrabold tracking-tight transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
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

          {/* Bio panel */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-brand p-6 text-white transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:translate-y-0 group-focus-visible:translate-y-0 ${
              open ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <p className="font-sans text-sm leading-relaxed sm:text-[15px]">{person.bio}</p>
          </div>
        </div>

        <div className={`mt-5 border-t pt-4 ${onDark ? 'border-white/15' : 'border-ink/12'}`}>
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
      </button>
    </li>
  )
}

function TeamSection({ id, kicker, title, lede, people, tone }) {
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

        <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p, i) => (
            <PersonCard key={`${p.role}-${i}`} person={p} index={i} tone={tone} />
          ))}
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
          className="anim-rise border-y border-ink/12"
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
      />

      {/* ══ 4 · CLOSE ════════════════════════════════════════════════ */}
      <section className="border-t border-ink/12 bg-fog py-20 sm:py-24">
        <div className="reveal mx-auto flex max-w-[100rem] flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-10">
          <p className="font-wide text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-brand">
            Want to talk to the team?
          </p>
          <WipeLink to="/contact">Get in touch</WipeLink>
        </div>
      </section>
    </>
  )
}
