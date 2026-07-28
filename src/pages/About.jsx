import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/* Client-supplied photography — each photograph used once. */
import tractorField from '../assets/tractor-field.webp' // John Deere on BKT Flotation 648
import dugarLogo from '../assets/dugar-logo.png'

/* ────────────────────────────────────────────────────────────────────
   ABOUT — redesigned to sit in the same world as Home rather than in a
   printed-document world of its own.

   What changed and why: the previous version was a light spec sheet —
   a mono document strip, a ruled "Sheet 01 / Sheet 02" index above every
   section, white from top to bottom. Read next to Home (carbon hero,
   full-bleed photography, green weight) it looked like a different site,
   and the ruled-index-per-section device was scaffolding rather than
   voice. Both are gone.

   The page now runs on weight and colour instead:

     1  HERO          white, centred, no imagery — one screen carried by
                      type alone, headline tracking down line by line,
                      facts ruled along the bottom edge
     2  THE TRADE     white — centred marked-up headline, taped photographic
                      plate left, drop-capped essay column right
     3  COMMITMENTS   brand-green drench, three ruled undertakings
     4  THE GROUP     white — a centred colophon plate on a narrow measure:
                      the group mark, the statement at scale, and the
                      explanation stacked down one axis

   Below the hero this is three folds, not five. The earlier page put a
   type-only spread directly under a type-only hero, so nothing changed
   gear after the masthead, then spent a whole section on a photograph
   with a caption under it and another on a fog-coloured colophon. The
   spread and the photograph are now one composition (2), and the colophon
   is the first band of the finale (4). Every line of copy survived the
   merge; the fog surface did not, because white → green → carbon is a
   harder run without it.

   The hero is deliberately empty of everything but type — the client
   asked for white and centred, so the composition has to hold on
   letterforms and air, and the photography starts immediately below it.
   Only the hero carries a kicker.

   Copy: no figures. Years-in-trade, tyres-sold, dealer counts and
   satisfaction scores were removed at the client's instruction and are
   not reinstated. Every claim below already appears on Home or Contact.
   ──────────────────────────────────────────────────────────────────── */

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/* Button: translucent fill and a hairline at rest, with a panel wiping in
   from the left on hover. `tone` flips it for carbon surfaces, where the
   wipe lands on the light green from the logo rather than on brand green
   (which is too close to carbon in value to register). */
const WipeLink = ({ to, children, tone = 'light' }) => {
  const onDark = tone === 'dark'
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center gap-3 overflow-hidden border px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        onDark
          ? 'border-white/35 bg-white/[0.08] text-white hover:text-carbon focus-visible:outline-brand-glow'
          : 'border-ink/20 bg-ink/[0.02] text-ink hover:text-white focus-visible:outline-brand'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none ${
          onDark ? 'bg-brand-glow' : 'bg-brand'
        }`}
      />
      <span className="relative">{children}</span>
      <Arrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
    </Link>
  )
}

/* Same marker Home uses: a dot and a rule fading into the label on each
   side. Used once on this page, in the hero — not above every section. */
const Kicker = ({ children }) => (
  <div className="flex items-center justify-center gap-4">
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand" />
    </span>
    <span className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-brand">
      {children}
    </span>
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand" />
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
    </span>
  </div>
)

/* Ruled along the bottom edge of the hero: label above value, divided by
   hairlines. The instrument-panel reading Home's ticker rail gets, but
   static, because this is reference rather than atmosphere — and here it
   also does the work of closing the hero off, since there is no
   photograph edge to end it. */
const facts = [
  { label: 'Role', value: 'Authorised BKT distributor' },
  { label: 'Based', value: 'Kathmandu, Nepal' },
  { label: 'Hours', value: 'Sun–Fri · 09–18' },
  { label: 'Dispatch', value: 'Nationwide · 48h' },
]

/* Each commitment is traceable to wording already on Contact — none of it is
   new claim-making. */
const commitments = [
  {
    head: 'Genuine stock',
    body: 'Every tyre we sell is genuine BKT, bought through the proper channel. Read the sidewall when it arrives — the size, the load index, the manufacturing week. If those markings are ever incomplete or inconsistent, it did not come from us.',
  },
  {
    head: 'Advice before the sale',
    body: 'Tell us the machine and the ground it works, and we size from the axle load rather than from whatever is in the rack. Sometimes that means a smaller order than you came in for, or a straight answer that we do not have the right tyre today.',
  },
  {
    head: 'The warranty, honoured',
    body: 'Every tyre carries the full manufacturer warranty and we honour it in full. A claim is a conversation with the same desk that sold you the tyre — not a form, and not somebody else’s problem.',
  },
]

export default function About() {
  /* Reveal-on-scroll, matching Home and Contact: content is visible unless the
     observer runs, and a failsafe reveals everything if it never reports. */
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
      {/* One screen of white: viewport height less the fixed navbar (6rem).
          Nothing but type, centred on the measure, with the facts ruled
          across the bottom to give the composition a floor.

          This masthead is the spec the Blog masthead follows — same screen
          height, same type scale, same measure, same full-bleed ruled rail
          at the foot. Change one, change both. */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col bg-white">
        <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
          <div className="anim-rise">
            <Kicker>About BKT Tyres</Kicker>
          </div>

          {/* Each line tracks down from behind its own mask on load — the
              page's one piece of choreography, and the reason the hero
              doesn't need a second device. */}
          <h1 className="font-wide anim-lines mt-8 text-[clamp(2.5rem,min(8.5vw,12vh),6rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink">
            <span className="line-mask">
              <span>The people</span>
            </span>
            <span className="line-mask">
              <span>behind the</span>
            </span>
            <span className="line-mask">
              <span className="text-brand">tyres you run.</span>
            </span>
          </h1>

          <p
            className="anim-rise mt-8 max-w-[54ch] font-sans text-base leading-relaxed text-ash sm:text-lg text-pretty"
            style={{ animationDelay: '420ms' }}
          >
            We supply genuine BKT tyres across Nepal — for the farm, the site and
            the road — and we stand behind every one of them long after it leaves
            the shelf.
          </p>

          <div
            className="anim-rise mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: '520ms' }}
          >
            <WipeLink to="/contact">Talk to the desk</WipeLink>
            <WipeLink to="/products">See the range</WipeLink>
          </div>
        </div>

        {/* Facts rail — ruled top and bottom, since the section below it is
            also white and there is no photograph edge to divide them. */}
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

      {/* ══ 2 · THE TRADE ════════════════════════════════════════════ */}
      {/* Redesigned again, from the headline-left / plate-right split into a
          broadsheet interlock. The headline no longer shares its columns with
          anything: it runs the full measure at the fold's largest scale, each
          line stepping in from behind its own mask, with the green phrase
          carrying the marker stroke. The photograph then climbs up behind the
          headline's last line instead of standing politely beside it, so type
          and plate genuinely overlap — the one move the old fold gestured at
          but never made. Prose reads down the left: the lead sentence at
          display weight, then the ruled reading column, both sitting clear of
          the plate on a 5/7 split. The fold opens on the headline itself —
          no rule, no running head above it. Copy unchanged, word for word. */}
      <section className="overflow-hidden bg-white">
        <div className="relative z-20 mx-auto max-w-[100rem] px-4 pt-20 sm:px-6 sm:pt-28 lg:px-10 lg:pt-36">
          {/* Headline — centred, at a quieter scale, with no marker stroke
              under the green phrase. The last line is the one the photograph
              will rise up behind. */}
          <h2 className="reveal text-center font-wide text-[clamp(2rem,4.6vw,4.25rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-ink">
            <span className="line-mask">
              <span>Two decades</span>
            </span>
            <span className="line-mask">
              <span>
                keeping <span className="whitespace-nowrap text-brand">Nepal moving.</span>
              </span>
            </span>
          </h2>
        </div>

        <div className="mx-auto max-w-[100rem] px-4 pb-20 sm:px-6 sm:pb-28 lg:px-10 lg:pb-36">
          {/* The pair sits centred on its own measure rather than spanning the
              full 100rem shell — at that width the plate and the essay drift to
              opposite edges of the screen and stop reading as one composition. */}
          <div className="mx-auto mt-14 grid max-w-[78rem] items-start gap-x-14 gap-y-14 sm:mt-16 lg:grid-cols-12">
            {/* Left — the plate in the site's own card language: the same
                rounded 4/5 panel and full-bleed photograph the Home category
                cards use. No caption and no scrim — the scrim existed only to
                carry type that is no longer there. */}
            <div
              className="reveal relative z-0 lg:col-span-5 lg:mt-[clamp(0.5rem,1.5vw,1.5rem)]"
              style={{ transitionDelay: '120ms' }}
            >
              <figure className="clip-rise relative m-0 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-steel">
                <img
                  src={tractorField}
                  alt="A tractor working a flowering meadow on BKT Flotation 648 tyres"
                  className="h-full w-full object-cover object-[center_62%]"
                  loading="lazy"
                />
              </figure>
            </div>

            {/* Right — the essay. One voice throughout, opened by a drop cap
                so the column starts on a mark rather than on a margin. */}
            <div className="flex flex-col justify-center lg:col-span-7 lg:py-4">
              <div
                className="reveal max-w-[64ch] font-sans text-base font-medium leading-[1.65] text-ink sm:text-[17px]"
                style={{ transitionDelay: '90ms' }}
              >
                <p className="text-pretty first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-wide first-letter:text-[3.6rem] first-letter:font-extrabold first-letter:uppercase first-letter:leading-[0.74] first-letter:text-brand">
                  BKT Tyres has been supplying tyres in Nepal for over two decades — for
                  passenger cars, for farm machinery, and for the heavy commercial fleets
                  that keep goods moving between them.
                </p>

                <p className="mt-7 text-pretty">
                  BKT is an off-highway tyre maker: tractor and harvester fitments,
                  earthmoving and construction patterns, industrial and material-handling
                  sizes — tyres built for ground that would finish an ordinary road tyre
                  inside a season. That range is what brought the brand to Nepal, and it
                  is still the heart of what we stock.
                </p>

                <p className="mt-7 text-pretty">
                  The country asks a lot of a tyre. Hill roads that climb and drop all
                  day, monsoon mud on the approach to every field, gravel and broken
                  tarmac between the towns, and loads that are rarely light. A casing
                  that survives that has to be chosen for it, not simply sold.
                </p>

                <p className="mt-7 text-pretty">
                  We are an authorised BKT distributor. The tyres themselves are built and
                  tested by BKT and carry the full manufacturer warranty. What this
                  business adds is the rest of it — stock you can actually get hold of,
                  sizing checked against your own machine, and someone who will tell you
                  when the answer is no.
                </p>

                <p className="mt-7 text-pretty">
                  The machines have changed a great deal in two decades. The part we are
                  judged on has not: whether the tyre we put on your vehicle was the
                  right one for it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3 · COMMITMENTS ══════════════════════════════════════════ */}
      {/* Brand green carrying the whole surface — the one place on the site
          where it does, and the reason the fog band that used to follow it
          is gone.

          Redesigned from three stacked rows into three standing columns. The
          old shape put each heading in a left column and its paragraph in a
          right one, so every undertaking left a heading-shaped hole beneath
          it and the band ran three screens deep on the strength of 500 words.
          Worse, it read as three unrelated rows rather than as the set of
          three the lede promises. Here each undertaking is a column: index,
          heading and paragraph in one measure, standing beside its siblings
          and separated by a rule that draws downward as the band arrives —
          the same drawn-rule device as before, turned ninety degrees so the
          structure is the thing you actually see on a flat green field.
          Copy unchanged, word for word.

          Surface: the green drench is now a light green-tinted paper
          (--color-mist), so the brand green itself can carry the accent —
          #007735 on that paper is 4.9:1, which clears AA at every size the
          band uses, where green-on-green never could. */}
      <section className="bg-mist text-ink">
        <div className="mx-auto max-w-[100rem] px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
          {/* Head: the headline alone, centred over the three columns it
              introduces, sitting on the rule that opens the set. The lede that
              used to sit opposite it only restated what the three columns say
              in full — with the set now legible at a glance, it was a caption
              on something already captioned. */}
          <div className="reveal border-b border-ink/15 pb-10 lg:pb-12">
            <h2 className="font-wide mx-auto max-w-[18ch] text-center text-[clamp(2rem,4.4vw,3.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-balance">
              What we <span className="text-brand">stand for</span>
            </h2>
          </div>

          <ol className="grid list-none grid-cols-1 p-0 lg:grid-cols-3">
            {commitments.map((c, i) => (
              <li
                key={c.head}
                className={`reveal relative pb-12 pt-10 sm:pt-12 lg:pb-16 lg:pt-14 ${
                  i === 0 ? 'lg:pr-12' : i === 1 ? 'lg:px-12' : 'lg:pl-12'
                }`}
                style={{ transitionDelay: `${i * 130}ms` }}
              >
                {/* Divider between siblings: a drawn rule above on the stacked
                    layout, the same rule stood on its end once the columns sit
                    side by side. The first item never carries one — the head's
                    own rule is already above it. */}
                {i > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="rule-draw absolute inset-x-0 top-0 h-px bg-ink/15 lg:hidden"
                    />
                    <span
                      aria-hidden="true"
                      className="rule-draw-y absolute left-0 top-0 hidden h-full w-px bg-ink/15 lg:block"
                    />
                  </>
                )}

                <span className="block font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-brand tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                  <span className="text-ash/70"> / 03</span>
                </span>

                {/* Condensed display against the wide heading above it — the
                    page's one real type-contrast, and the reason these read
                    as headings rather than as bold paragraphs. */}
                {/* Sized to the narrowest column rather than to the page: the
                    longest of the three headings ("The warranty, honoured") has
                    to sit on one line inside a third of the measure, so the
                    ceiling is set by that heading, not by how large the type
                    could go. Condensed display is what buys the room. */}
                <h3 className="font-display mt-6 text-[clamp(1.5rem,1.95vw,1.9rem)] font-bold uppercase leading-[1.05] tracking-tight whitespace-nowrap">
                  {c.head}
                </h3>

                <p className="mt-5 max-w-[44ch] font-sans text-[15px] leading-[1.75] text-ash sm:text-base">
                  {c.body}
                </p>
              </li>
            ))}
          </ol>

          {/* Closes the set off, drawn the same way the dividers are. */}
          <div className="reveal relative h-px" style={{ transitionDelay: '390ms' }}>
            <span aria-hidden="true" className="rule-draw absolute inset-0 bg-ink/15" />
          </div>
        </div>
      </section>

      {/* ══ 4 · THE GROUP ════════════════════════════════════════════ */}
      {/* The finale: the ownership band alone, on white. The closing statement
          that used to sit under it — headline, the two buttons and the Monster
          Jam plate — is gone at the client's request; the hero at the top of
          the page carries the same two calls to action, so the page still has
          a door out of it. White rather than carbon because the footer
          directly below is black, and a dark finale would dissolve into it. */}
      {/* Composition: a colophon plate — the closing page of a book, not a
          band with things arranged across it.

          Every earlier attempt spread the same three items (mark, statement,
          paragraph) sideways across the full 100rem shell: as cells on one
          vertically-centred line, then as a mark hanging in its own margin
          column beside a left-set text column. Both fail the same way. There
          is only one heading, one paragraph and one logo here, and no
          arrangement of three small things fills 1,400px — so whichever
          columns they are put in, the leftovers show up as a hole, either in
          the middle of the row or under the mark.

          The fix is to stop claiming the width. The plate is 64rem, centred,
          and the statement is scaled up to the largest type on the page after
          the hero, so the fold reads as one mass instead of three fragments,
          and the white either side is symmetrical air rather than a gap where
          something is missing. Kicker, mark, statement, a signature rule and
          the explanation stack down one axis, ruled top and bottom, so the
          page ends the way its sections are divided. Copy unchanged. */}
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[100rem] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
          {/* No panel, no tint — white paper, and structure drawn with rules
              instead of a fill, as everywhere else on the page. */}
          <div className="reveal relative mx-auto flex max-w-[64rem] flex-col items-center py-16 text-center sm:py-20">
            <span aria-hidden="true" className="rule-draw absolute inset-x-0 top-0 h-px bg-ink/15" />

            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-brand" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ash">
                Group ownership
              </span>
            </div>

            {/* The mark at seal scale, unaltered and on nothing — no plate, no
                ring, no wash. It carries its own circle, and anything drawn
                behind it either reads as a target or as a smudge. */}
            <img
              src={dugarLogo}
              alt="MV Dugar Group"
              className="mt-9 h-20 w-auto sm:h-24"
              loading="lazy"
            />

            {/* The statement at the largest scale on the page after the hero —
                the mass the fold was missing when this was three small things
                spread across the shell. The green phrase is kept whole: "MV"
                belongs to the group's name, not to the line above it, so the
                break falls before the name rather than inside it, which is
                also what gives the statement its two masked lines. */}
            {/* Floor of 2rem, not 2.25: the group's name is set nowrap, and at
                any larger minimum it runs off a 320px screen. */}
            <h2 className="font-wide mt-9 text-[clamp(2rem,6.4vw,5rem)] font-extrabold uppercase leading-[0.86] tracking-tight">
              <span className="line-mask">
                <span>Part of the</span>
              </span>
              <span className="line-mask">
                <span className="whitespace-nowrap text-brand">MV Dugar Group</span>
              </span>
            </h2>

            {/* Change of voice made visible, at the width of a signature
                underline rather than a divider. */}
            <span aria-hidden="true" className="mt-11 block h-px w-20 bg-brand" />

            <p className="mt-8 max-w-[58ch] font-sans text-base leading-[1.8] text-ash sm:text-[17px] text-pretty">
              The tyre business sits inside a larger group, and that is the part you
              never see: the buying, the warehousing, the working capital that keeps
              stock on the shelf when a season turns. It is why we can say yes to a
              fleet order and still have your size next week.
            </p>

            <span aria-hidden="true" className="rule-draw absolute inset-x-0 bottom-0 h-px bg-ink/15" />
          </div>
        </div>
      </section>
    </>
  )
}
