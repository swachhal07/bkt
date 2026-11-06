import { Link } from 'react-router-dom'
import bktLogo from '../assets/pngfind.com-tire-marks-png-139014.png'
import dugarLogo from '../assets/dugar-logo.png'

/* NOTE: phone, address, social and legal links are placeholders — swap for the
   client's real details when available. Email is the working contact address. */

/* ────────────────────────────────────────────────────────────────────
   FOOTER — rebuilt from a centred stack into a masthead.

   What was wrong: seven blocks — logos, statement, nav, contact line,
   rule, legal, copyright — each centred on its own line down the middle
   of a 7xl shell, separated by 2.5–3.5rem of air. Centring everything
   is what a footer does when it has no structure: the column of text
   ran about a third of the width, both margins stayed empty, and
   nothing in it was ranked, so the developer credit sat at the same
   size and weight as the phone number. None of the site's own
   vocabulary appeared in it either — no hairline rules, no mono
   legends, no ruled rows, none of the devices every section above it
   is built from.

   Now four bands on the full measure, divided by rules:

     A  IDENTITY   the two marks, against the contact details as a ruled
                   three-cell strip
     B  INDEX      the five pages as a ruled row of numbered cells, each
                   wiping green from the left on hover
     C  SIGN-OFF   the statement alone, edge to edge, at the largest
                   scale anywhere on the site
     D  COLOPHON   legal, copyright and credit on one line, in mono at
                   footnote scale — ranked below everything else rather
                   than stacked at the same weight as it

   The statement moved to the floor on the second pass. Set beside the
   contact rows at the top it could only have half the measure, so it
   fitted on one line with the rest of its column empty beside it and a
   dead field of black beneath it — the footer was structured by then,
   but a third of it was doing nothing. Run across the full width at the
   bottom it is the mass rather than a heading above one, it signs the
   page off directly over the fine print, and the space it used to waste
   is the thing you now read.

   Copy unchanged, link for link.
   ──────────────────────────────────────────────────────────────────── */

const nav = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const contact = [
  { label: 'Visit', value: 'Kathmandu, Nepal' },
  { label: 'Call', value: '+977 00-000 0000', href: 'tel:+97700000000' },
  { label: 'Email', value: 'info@bkttyres.com', href: 'mailto:info@bkttyres.com' },
]

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/* Mono legend with the site's square marker, as used above every band on
   Contact and About. */
const Legend = ({ children }) => (
  <span className="flex items-center gap-2.5">
    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-brand-glow" />
    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
      {children}
    </span>
  </span>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Atmosphere: one soft wash of the light green from the logo, bled off
          the bottom-left corner so it lights the statement it sits under. On
          black it reads as depth; the same device on white read as a smudge,
          which is why it is only used here. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -left-40 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(140,198,63,0.11),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        {/* ══ A · IDENTITY ═══════════════════════════════════════════ */}
        {/* Marks and contact on one strip. Both are reference material — who
            this is and how to reach them — so they belong on the same line at
            the same rank, not in a tall column each. */}
        <div className="grid items-center gap-x-12 gap-y-10 py-12 lg:grid-cols-12 lg:py-14">
          <div className="lg:col-span-4">
            {/* The two marks, kept as a lockup and divided by the same
                hairline as before — the one part of the old footer that was
                already doing its job. */}
            <div className="flex items-center gap-4">
              <Link to="/" aria-label="BKT Tyres — home" className="inline-flex">
                <img src={bktLogo} alt="BKT Tyres" className="h-11 w-auto sm:h-12" />
              </Link>
              <span className="h-9 w-px bg-white/20" aria-hidden="true" />
              <img src={dugarLogo} alt="MV Dugar Group" className="h-11 w-auto sm:h-12" />
            </div>
          </div>

          {/* Contact as three ruled cells rather than three items strung on one
              line with bullets between them. Laid across the row, they fill
              the measure the statement used to leave half-empty. */}
          <dl className="grid grid-cols-1 gap-px bg-white/10 lg:col-span-8 lg:grid-cols-3">
            {contact.map((c) => (
              <div key={c.label} className="bg-black px-0 py-4 lg:px-6 lg:first:pl-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                  {c.label}
                </dt>
                <dd className="mt-2 font-sans text-base text-white/85 sm:text-[17px]">
                  {c.href ? (
                    <a
                      href={c.href}
                      className="transition-colors hover:text-brand-glow"
                    >
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ══ B · INDEX ══════════════════════════════════════════════ */}
        {/* The pages as a numbered index across the full measure. Green wipes
            up from the floor of a cell on hover — the same wipe the buttons
            use, turned to run along the rule instead of across a panel. */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-1 border-t border-white/10 lg:grid-cols-6"
        >
          {nav.map((item, i) => (
            /* One column until the row can hold all five. Two- and three-column
               intermediates are worse than stacking: five items never fill
               them, and the empty cell shows up as a rule that stops short. */
            <Link
              key={item.label}
              to={item.to}
              className={`group relative flex items-baseline gap-3 border-b border-white/10 py-5 transition-colors last:border-b-0 hover:text-brand-glow sm:py-6 lg:border-b-0 lg:border-l lg:border-white/10 lg:py-7 ${
                i === 0 ? 'lg:border-l-0 lg:pl-0' : 'lg:pl-8'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-brand-glow transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <span className="font-mono text-[10px] tabular-nums text-white/30 transition-colors group-hover:text-brand-glow/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-wide text-lg font-bold uppercase tracking-tight sm:text-xl">
                {item.label}
              </span>
              <Arrow className="ml-auto mr-4 h-4 w-4 shrink-0 self-center opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none lg:mr-6" />
            </Link>
          ))}
        </nav>

        {/* ══ C · SIGN-OFF ═══════════════════════════════════════════ */}
        {/* The statement, edge to edge. Sized off the viewport so it fills the
            measure at any width rather than sitting at a fixed scale with air
            beside it — the whole point of moving it down here. Uppercase to
            match every other heading on the site; the sentence case it used to
            be set in was the only place that broke. */}
        <div className="border-t border-white/10 pb-10 pt-12 sm:pb-12 sm:pt-16">
          {/* 12vw, not more: set in this face at this weight the line measures
              7.6× its own font size, so 12vw is the largest step that still
              clears the shell's padding at every width and keeps it on one
              line. 12.4 wrapped "Road." onto a second line at 1440. The cap
              holds it to the measure once the shell stops growing at 100rem. */}
          <h2 className="font-wide text-[clamp(2.25rem,12vw,12.4rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.02em]">
            Grip the <span className="text-brand-glow">Road.</span>
          </h2>
        </div>

        {/* ══ D · COLOPHON ═══════════════════════════════════════════ */}
        {/* Everything that is small print, set as small print and on one line,
            rather than as three centred paragraphs at reading size. */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="order-2 sm:order-1">
            © {year} BKT Tyres. All rights reserved.
          </p>

          <div className="order-1 flex flex-wrap items-center gap-x-6 gap-y-2 sm:order-2">
            <a href="#" className="transition-colors hover:text-brand-glow">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-brand-glow">
              Terms &amp; Conditions
            </a>
          </div>

          <p className="order-3">
            Developed by <span className="text-brand-glow">Swachhal Lamsal</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
