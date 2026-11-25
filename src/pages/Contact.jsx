import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TreadKicker from '../components/TreadKicker'
import tyreDetail from '../assets/tyre-detail.webp'
import bktTruck from '../assets/bkt-truck.webp'
import tractorField from '../assets/tractor-field.webp'
import sectorOtr from '../assets/sector-otr.webp'

/* Contact details from the BKT Tire Nepal Distributor Facebook page
   (facebook.com/bkttirenepal), kept in step with the footer. The phones shown
   are the two sales lines. The enquiry form composes a
   mailto to EMAIL; wire `handleSubmit` to a real form endpoint (Formspree /
   server route) when ready. */
const PHONES = [
  { display: '9802780690', href: '+9779802780690' },
  { display: '9802952894', href: '+9779802952894' },
]
const PHONE_DISPLAY = PHONES.map((p) => p.display).join(' / ')
const EMAIL = 'bktservice@mvdugar.com'
/* Address from the same Facebook page; the map pin below sits in the same
   ward (Kathmandu-16, Banasthali/Balaju). */
const ADDRESS = 'Balaju Industrial District, Kathmandu'

/* Showroom position, client-supplied. Everything map-related derives from this one
   pair, so a correction is a one-line change.
   `output=embed` is the keyless Maps embed — it drops a pin at `q` and needs no
   API key. The directions link carries only a destination, so Google routes from
   wherever the visitor actually is rather than from a baked-in origin. */
const SHOWROOM_LAT_LNG = '27.7300363,85.3020595'
const COORDS = '27.7300° N · 85.3021° E'
const MAP_EMBED = `https://maps.google.com/maps?q=${SHOWROOM_LAT_LNG}&z=16&output=embed`
const DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${SHOWROOM_LAT_LNG}`

/* ── Inline icon set ── */
const Icon = {
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
}

/* Boxed field: a fog-filled tile with its label set inside, which turns white
   with a brand edge while it has focus. The whole tile is the label, so a tap
   anywhere on it lands in the input. */
const Box = ({ id, label, required = false, error, className = '', children }) => (
  <div className={className}>
    <label
      htmlFor={id}
      className={`block cursor-text rounded-xl border px-4 pb-3 pt-3 transition-colors duration-300 focus-within:border-brand focus-within:bg-white ${
        error ? 'border-rust bg-white' : 'border-transparent bg-fog hover:border-ink/15'
      }`}
    >
      <span className="block font-sans text-xs font-semibold text-ash">
        {label}
        {required && <span className="ml-0.5 text-brand">*</span>}
      </span>
      {children}
    </label>
    {error && (
      <p id={`err-${id}`} className="mt-1.5 pl-1 font-sans text-sm text-rust">
        {error}
      </p>
    )}
  </div>
)

const inputCls =
  'mt-1 block w-full appearance-none rounded-none border-0 bg-transparent p-0 font-sans text-base text-ink placeholder:text-ink/30 focus:outline-none'

/* Dotted-leader row, as used on a printed spec sheet. `tone` follows the same
   convention as Cross: 'dark' = dark marks on light stock, 'light' = the inverse. */
const SpecRow = ({ label, value, href, tone = 'dark' }) => {
  const onDark = tone === 'light'
  return (
    <div className="flex items-baseline gap-3 py-3">
      <span className={`font-mono text-[11px] uppercase tracking-[0.18em] sm:text-xs ${onDark ? 'text-white/45' : 'text-ash'}`}>
        {label}
      </span>
      <span className={`min-w-6 flex-1 translate-y-[-0.3rem] border-b border-dotted ${onDark ? 'border-white/25' : 'border-ink/25'}`} />
      {href ? (
        <a
          href={href}
          className={`font-mono text-xs font-medium uppercase tracking-[0.08em] underline decoration-2 underline-offset-4 transition-colors sm:text-[13px] ${
            onDark
              ? 'text-white decoration-brand-glow/50 hover:text-brand-glow'
              : 'text-ink decoration-brand/40 hover:text-brand'
          }`}
        >
          {value}
        </a>
      ) : (
        <span className={`font-mono text-xs font-medium uppercase tracking-[0.08em] sm:text-[13px] ${onDark ? 'text-white' : 'text-ink'}`}>
          {value}
        </span>
      )}
    </div>
  )
}

const specs = [
  { label: 'Response time', value: '< 1 business day' },
  { label: 'Hours', value: 'Sun–Fri · 09–18' },
  { label: 'Location', value: ADDRESS },
  { label: 'Dispatch', value: 'Nationwide · 48h' },
]

/* Visiting facts for the closing site plan. */
const visitFacts = [
  { label: 'Address', value: ADDRESS, note: 'Pinned on the map' },
  { label: 'Opening hours', value: 'Sun–Fri · 09:00–18:00', note: 'Closed Saturday' },
  { label: 'Sales', value: PHONE_DISPLAY, note: 'Call either line' },
]

/* Closing wayfinding. Each blurb is drawn from the destination page's own
   opening copy, so a visitor who came to Contact by mistake is routed by an
   honest description rather than a slogan. */
const destinations = [
  {
    to: '/products',
    kicker: 'The range',
    title: 'Our tyres',
    desc: 'Farm, site and road patterns — a tyre for every vehicle and every road.',
    img: tyreDetail,
    alt: 'Close detail of a BKT tyre tread',
  },
  {
    to: '/about',
    kicker: 'The company',
    title: 'Who we are',
    desc: 'Two decades of quality manufacturing, hard testing and honest service.',
    img: bktTruck,
    alt: 'A truck running on BKT tyres',
  },
  {
    to: '/blog',
    kicker: 'From the field',
    title: 'News & advice',
    desc: 'Guides and product news from the farm, the site and the road.',
    img: tractorField,
    alt: 'A tractor working a field on BKT agricultural tyres',
  },
]

const enquiryTypes = [
  'General enquiry',
  'Request a quote',
  'Technical / fitment advice',
  'Warranty claim',
  'Bulk / fleet order',
]

const steps = [
  { n: '01', title: 'You send the details', desc: 'Machine, sizes, quantities — whatever you know.' },
  { n: '02', title: 'We match the spec', desc: 'Load rating, tread, fitment. Checked against stock.' },
  { n: '03', title: 'You get a quote', desc: 'Priced, with lead time. No obligation either way.' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* The message is only required when the visitor hasn't named a tyre or size —
   an enquiry that arrives from a size row already says what it's about. */
const requiredFor = (form) =>
  form.tyre.trim() || form.size.trim() ? ['name', 'email'] : ['name', 'email', 'message']

/* A fresh sheet. Arriving from a tyre page or the finder (/contact?tyre=&size=)
   fills in the tyre and size and switches the job to a quote. */
const blankForm = (tyre = '', size = '') => ({
  name: '',
  email: '',
  phone: '',
  tyre,
  size,
  quantity: '',
  type: tyre || size ? 'Request a quote' : enquiryTypes[0],
  message: '',
})

export default function Contact() {
  const [params] = useSearchParams()
  const [form, setForm] = useState(() => blankForm(params.get('tyre') ?? '', params.get('size') ?? ''))
  const required = requiredFor(form)
  const prefilled = !!(params.get('tyre') || params.get('size'))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const successRef = useRef(null)

  /* Reveal-on-scroll. Content must never stay hidden — if IntersectionObserver
     never reports (some embedded webviews don't run it), a failsafe reveals all. */
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

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!form.email.trim()) next.email = 'We need an email to reply to you.'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'That email doesn’t look right.'
    if (required.includes('message')) {
      if (!form.message.trim()) next.message = 'Let us know how we can help.'
      else if (form.message.trim().length < 10) next.message = 'A little more detail helps us help you.'
    }
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      const first = document.getElementById(`field-${Object.keys(next)[0]}`)
      first?.focus()
      return
    }

    const tyreLine = [form.tyre.trim(), form.size.trim()].filter(Boolean).join(' — ')
    const subject = `Website enquiry — ${form.type}${tyreLine ? ` — ${tyreLine}` : ''}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone.trim() && `Phone: ${form.phone}`,
      `Enquiry type: ${form.type}`,
      form.tyre.trim() && `Tyre: ${form.tyre}`,
      form.size.trim() && `Size: ${form.size}`,
      form.quantity.trim() && `Quantity: ${form.quantity}`,
      '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setSubmitted(true)
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const filled = required.filter((k) => form[k].trim()).length

  return (
    <>
      {/* ══ SHEET: masthead + enquiry form ════════════════════════════ */}
      {/* `main` in App.jsx already clears the fixed navbar, so the document
          strip sits flush beneath it — no extra top padding here. */}
      <section className="relative overflow-hidden bg-white">
        {/* ── Document header strip ── */}
        <div className="relative border-y border-ink/12">
          <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-10">
            {/* One line each on phones: tighter tracking below sm, and the
                left label truncates rather than wrapping on very narrow screens. */}
            <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink sm:tracking-[0.28em]">
              BKT Tyres <span className="text-ash">/</span> Customer enquiry
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-ash sm:block">
              Form WEB–CTC–01
            </span>
            <span className="flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-ash sm:tracking-[0.28em]">
              <span className="h-1.5 w-1.5 animate-pulse bg-brand" aria-hidden="true" />
              Desk open
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
          {/* ── Masthead: headline, lead copy and spec block share one screen.
                 Two columns split 7/5 on the same grid the form below uses. ── */}
          <div className="grid min-h-[calc(100svh-8.25rem)] items-center gap-x-10 gap-y-12 py-10 sm:py-12 lg:grid-cols-12">
            {/* Centred while stacked; left-aligned beside the spec block from lg. */}
            <div className="text-center lg:col-span-7 lg:text-left">
              {/* Site-wide section marker (tread ticks). */}
              <div className="anim-rise">
                <TreadKicker className="lg:justify-start">Contact desk</TreadKicker>
              </div>

              {/* Fluid display type: sized to fill its column at any width, and
                  capped against viewport height so the whole masthead stays in view.
                  Each line tracks down from behind its own mask on load — the same
                  entrance, line count and stagger as the About and Blog mastheads. */}
              <h1 className="font-wide anim-lines mt-7 text-[clamp(2.25rem,min(7.3vw,11.5vh),8.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink">
                <span className="line-mask">
                  <span>Tell us</span>
                </span>
                <span className="line-mask">
                  <span>what you run</span>
                </span>
                <span className="line-mask">
                  <span className="text-brand">we&rsquo;ll fit it.</span>
                </span>
              </h1>

              <p className="anim-rise mx-auto mt-8 max-w-xl font-sans text-base leading-relaxed text-ash sm:text-lg lg:mx-0" style={{ animationDelay: '420ms' }}>
                Sizing advice, a fleet quote, or a dealership enquiry — fill in the
                sheet below and it lands with the person who can actually answer it.
                Genuine BKT stock, straight answers, no runaround.
              </p>

              <div className="anim-rise mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start" style={{ animationDelay: '520ms' }}>
                {/* One phone line, both sales numbers; each number is its own
                    tap-to-call link. */}
                <span className="inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink">
                  <Icon.phone className="h-4 w-4" />
                  {PHONES.map((p, i) => (
                    <span key={p.href} className="inline-flex items-center gap-3">
                      {i > 0 && <span aria-hidden="true" className="text-ash">/</span>}
                      <a href={`tel:${p.href}`} className="transition-colors hover:text-brand">
                        {p.display}
                      </a>
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Spec block */}
            <div className="anim-rise lg:col-span-5 lg:border-l lg:border-ink/12 lg:pl-10" style={{ animationDelay: '620ms' }}>
              <span className="block text-center font-mono text-[11px] uppercase tracking-[0.28em] text-ash lg:text-left">
                At a glance
              </span>
              <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {specs.map((s) => (
                  <SpecRow key={s.label} label={s.label} value={s.value} />
                ))}
                <SpecRow label="Email" value={EMAIL} href={`mailto:${EMAIL}`} />
              </div>
              <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-ash">
                Authorized BKT distributor. Every tyre carries the full manufacturer
                warranty, honoured in full.
              </p>
            </div>
          </div>

          {/* ── Enquiry ──
                 Two halves of one block: a carbon panel that says what happens
                 (closing on real BKT quarry photography rather than empty
                 column), and the form itself on boxed fields grouped by what
                 they're about. The job choice uses the site's skewed-slab
                 shape so the sheet speaks the same language as Home and About. */}
          <div id="enquiry" className="relative reveal scroll-mt-24 border-t border-ink/12 pb-24 pt-14 sm:pb-32 sm:pt-20">
            <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12 xl:gap-x-16">
              {/* ── Carbon panel ── */}
              <aside className="relative flex flex-col overflow-hidden rounded-[1.6rem] bg-carbon text-white lg:col-span-5">
                {/* @container: the one-line heading is sized against the panel's
                    own width (cqw), so it fills the line without wrapping. */}
                <div className="@container relative z-10 px-6 pt-8 sm:px-10 sm:pt-10">
                  <TreadKicker onDark align="left">Enquiry</TreadKicker>
                  <h2 className="font-wide mt-6 whitespace-nowrap text-[clamp(1.5rem,9.6cqw,3.75rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
                    Send us <span className="text-brand">the job.</span>
                  </h2>
                  <p className="mt-5 max-w-[36ch] font-sans text-base leading-relaxed text-white/60">
                    Whatever you know is enough to start. We&rsquo;ll fill in the rest.
                  </p>

                  <ol className="mt-9 border-t border-white/10">
                    {steps.map((s) => (
                      <li key={s.n} className="flex items-baseline gap-5 border-b border-white/10 py-5">
                        <span className="font-display w-8 shrink-0 text-2xl font-bold italic leading-none text-brand-glow tabular-nums">
                          {s.n}
                        </span>
                        <div>
                          <h3 className="font-sans text-[15px] font-bold text-white">{s.title}</h3>
                          <p className="mt-1 font-sans text-sm leading-relaxed text-white/55">{s.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Photo fills whatever height the form leaves, fading up into
                    the carbon so the steps above stay on a flat surface. */}
                <div className="relative mt-auto min-h-64 flex-1 sm:min-h-72">
                  <img
                    src={sectorOtr}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-carbon via-carbon/40 to-carbon/80" />
                  <div className="relative flex h-full flex-col justify-end px-6 pb-8 pt-16 sm:px-10 sm:pb-10">
                    <span className="font-sans text-sm font-semibold text-white/70">Rather talk it through?</span>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      {PHONES.map((p) => (
                        <a
                          key={p.href}
                          href={`tel:${p.href}`}
                          className="font-display text-2xl font-bold tracking-wide text-white transition-colors hover:text-brand-glow sm:text-[1.75rem]"
                        >
                          {p.display}
                        </a>
                      ))}
                    </div>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-1 w-fit font-sans text-sm text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-brand-glow"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </aside>

              {/* ── Form ── */}
              <div className="lg:col-span-7 lg:py-2">
                {submitted ? (
                  <div ref={successRef} tabIndex={-1} className="flex h-full flex-col justify-center outline-none">
                    <div className="anim-stamp w-fit border-[3px] border-brand px-7 py-3.5">
                      <span className="font-wide block text-3xl font-extrabold uppercase leading-none tracking-wide text-brand sm:text-4xl">
                        Received
                      </span>
                      <span className="mt-2 block border-t border-brand/40 pt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                        {form.type}
                      </span>
                    </div>

                    <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-ash">
                      Your email app should have opened with the message ready to
                      send. If nothing happened, write to{' '}
                      <a href={`mailto:${EMAIL}`} className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
                        {EMAIL}
                      </a>{' '}
                      and we&rsquo;ll pick it up from there.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false)
                        setErrors({})
                        setForm(blankForm())
                      }}
                      className="group mt-8 inline-flex w-fit items-center gap-3 border-b-2 border-ink/15 pb-1.5 font-sans text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                    >
                      Start a new enquiry
                      <Icon.arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {/* What it's about — first, because it changes how the
                        rest reads (a quote wants sizes, a claim wants a story). */}
                    <fieldset>
                      <legend className="font-wide text-lg font-bold text-ink">What do you need?</legend>
                      <div className="mt-4 flex flex-wrap gap-2.5 pl-1">
                        {enquiryTypes.map((t) => {
                          const active = form.type === t
                          return (
                            <label key={t} className="cursor-pointer">
                              <input
                                type="radio"
                                name="enquiry-type"
                                value={t}
                                checked={active}
                                onChange={update('type')}
                                className="peer sr-only"
                              />
                              <span
                                className={`block -skew-x-[9deg] rounded-[0.7rem_0.2rem_0.7rem_0.2rem] border px-4 py-2.5 transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand sm:px-5 ${
                                  active
                                    ? 'border-brand bg-brand text-white'
                                    : 'border-ink/15 bg-white text-ink hover:border-ink/40'
                                }`}
                              >
                                <span className="block skew-x-[9deg] font-sans text-sm font-semibold">{t}</span>
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>

                    {/* About you */}
                    <div className="mt-10">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-wide text-lg font-bold text-ink">About you</h3>
                        <span className="font-sans text-xs text-ash">
                          <span className="text-brand">*</span> required
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Box id="field-name" label="Name" required error={errors.name}>
                          <input
                            id="field-name"
                            type="text"
                            autoComplete="name"
                            value={form.name}
                            onChange={update('name')}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'err-field-name' : undefined}
                            className={inputCls}
                          />
                        </Box>
                        <Box id="field-phone" label="Phone">
                          <input
                            id="field-phone"
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={update('phone')}
                            placeholder="98XXXXXXXX"
                            className={inputCls}
                          />
                        </Box>
                        <Box id="field-email" label="Email" required error={errors.email} className="sm:col-span-2">
                          <input
                            id="field-email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={update('email')}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'err-field-email' : undefined}
                            className={inputCls}
                          />
                        </Box>
                      </div>
                    </div>

                    {/* The tyre — pre-filled when arriving from a tyre page or
                        the finder, and the panel says so. */}
                    <div className="mt-10">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-wide text-lg font-bold text-ink">The tyre</h3>
                        <span className="font-sans text-xs text-ash">if you know it</span>
                      </div>
                      {prefilled && (
                        <p className="mt-3 flex items-center gap-2.5 rounded-lg bg-mist px-4 py-2.5 font-sans text-sm text-brand">
                          <span className="h-2 w-2 shrink-0 -skew-x-[20deg] bg-brand" aria-hidden="true" />
                          Filled in from the tyre you were looking at — change anything that&rsquo;s off.
                        </p>
                      )}
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1.2fr_0.7fr]">
                        {[
                          { k: 'tyre', label: 'Pattern', hint: 'Agrimax RT 855', type: 'text' },
                          { k: 'size', label: 'Size', hint: '12.4-28', type: 'text' },
                          { k: 'quantity', label: 'Qty', hint: '4', type: 'number' },
                        ].map((f) => (
                          <Box key={f.k} id={`field-${f.k}`} label={f.label}>
                            <input
                              id={`field-${f.k}`}
                              type={f.type}
                              {...(f.type === 'number' ? { min: 1, inputMode: 'numeric' } : {})}
                              value={form[f.k]}
                              onChange={update(f.k)}
                              placeholder={f.hint}
                              className={inputCls}
                            />
                          </Box>
                        ))}
                      </div>
                    </div>

                    {/* The job */}
                    <div className="mt-10">
                      <h3 className="font-wide text-lg font-bold text-ink">The job</h3>
                      <div className="mt-4">
                        <Box
                          id="field-message"
                          label={required.includes('message') ? 'Machine, size, and where it works' : 'Anything else we should know'}
                          required={required.includes('message')}
                          error={errors.message}
                        >
                          <textarea
                            id="field-message"
                            rows={5}
                            value={form.message}
                            onChange={update('message')}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? 'err-field-message' : undefined}
                            placeholder="e.g. Two Mahindra 575s on rice paddy in Chitwan, rears worn through."
                            className={`${inputCls} resize-y leading-relaxed`}
                          />
                        </Box>
                      </div>
                    </div>

                    {/* Send — dark bar, green wipes in on hover (site button
                        grammar), with a plain count of what's still missing. */}
                    <button
                      type="submit"
                      className="group relative mt-10 flex w-full items-center justify-between overflow-hidden rounded-xl bg-ink px-6 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-8"
                    >
                      <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100" />
                      <span className="font-display relative text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        Send enquiry
                      </span>
                      <span className="relative flex items-center gap-4">
                        <span className="hidden font-sans text-sm text-white/55 sm:block">
                          {filled === required.length
                            ? 'Ready to send'
                            : `${required.length - filled} required ${required.length - filled === 1 ? 'field' : 'fields'} left`}
                        </span>
                        <Icon.arrow className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </button>

                    <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
                      Opens your email app with everything filled in. Usually answered
                      within one business day — and your details go nowhere else.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SITE PLAN ════════════════════════════════════════════════ */}
      {/* Closing plate — utilitarian wayfinding. Facts on the left, a drawn
          schematic of the valley on the right. The plan is built here rather than
          embedded: a graded Google iframe can't be styled, can't be kept legible,
          and can't put a marker on a real coordinate. This can do all three. */}
      <section className="relative bg-carbon text-white">
        <div className="mx-auto max-w-[100rem] px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
          {/* items-center: the facts block sits on the map plate's vertical centre
              rather than hanging from its top edge. */}
          <div className="reveal grid gap-x-14 gap-y-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
            {/* ── Facts ── */}
            <div className="min-w-0">
              {/* Fluid rather than stepped: the column is a 5fr track, so the
                  headline has to size against the column, not the breakpoint. The
                  36px floor keeps "FIND THE OFFICE" tidy at 320px. */}
              {/* Brand green (#007735), matching the masthead's "we'll fit it."
                  On carbon that's 3.42:1 — under AA for body copy, but over the 3:1
                  large-text threshold, which this clears at 36px+ extrabold. Don't
                  reuse this pairing at body sizes; use brand-glow there. */}
              {/* Centred while stacked over the map; left-aligned beside it from lg. */}
              <TreadKicker onDark className="lg:justify-start">Visit us</TreadKicker>
              <h2 className="font-wide mt-6 min-w-0 text-center lg:text-left text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-white [overflow-wrap:anywhere]">
                Find the <span className="text-brand">office</span>
              </h2>

              <p className="mx-auto mt-7 max-w-lg text-center font-sans text-base leading-relaxed text-white/65 sm:text-lg lg:mx-0 lg:text-left">
                We&rsquo;re at Balaju Industrial District, Kathmandu. Bring the tyre size
                &mdash; or a photo of the sidewall &mdash; and we&rsquo;ll match it
                against stock while you wait.
              </p>

              {/* Spec rows: label, value, and an honest note about the value's
                  status. Different divider language to the dotted leaders above,
                  so the two halves of the page don't read as one component. */}
              <dl className="mt-10 border-t border-white/12">
                {visitFacts.map(({ label, value, note }) => (
                  <div
                    key={label}
                    className="grid gap-x-6 gap-y-1 border-b border-white/12 py-4 text-center sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:text-left"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 sm:pt-1">
                      {label}
                    </dt>
                    <dd className="min-w-0">
                      <span className="block font-sans text-base font-semibold tabular-nums text-white">
                        {value}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                        {note}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <a
                href={DIRECTIONS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-10 flex w-full items-center justify-between gap-6 overflow-hidden border border-white/15 bg-white/5 px-6 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow sm:w-auto sm:px-8"
              >
                {/* Same wipe as the enquiry sign-off: neutral slab at rest, brand
                    green sweeping in from the left on hover. The hairline border is
                    what gives the translucent fill an edge against carbon. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="font-display relative whitespace-nowrap text-xl font-bold uppercase tracking-wide text-white">
                  Get directions
                </span>
                <Icon.arrow className="relative h-4 w-4 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 lg:text-left">
                Opens Google Maps
              </p>
            </div>

            {/* ── Map plate ──
                A real Google embed centred on the showroom's own coordinates, and
                deliberately left ungraded. The invert/hue-rotate filter that used
                to sit here is what turned the map olive and inverted every label.
                A light plate inside a hairline frame reads as a mounted map on the
                dark section, rather than as a widget dropped in. */}
            <figure className="m-0 min-w-0">
              <div className="relative aspect-[4/3] w-full border border-white/15 bg-steel sm:aspect-[3/2]">
                <iframe
                  title={`Map showing the BKT Tyres office in ${ADDRESS}`}
                  src={MAP_EMBED}
                  className="absolute inset-0 block h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-7 gap-y-2 border-t border-white/12 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-brand-glow" />
                  Pin marks the office
                </span>
                <span className="text-white/25">{COORDS}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ══ ELSEWHERE ════════════════════════════════════════════════ */}
      {/* Closing plate — an outward door, not another pitch. Someone who reaches
          the end of a contact page without writing anything wanted a different
          page; this hands them three, with photography rather than more ruled
          type. Deliberately no reveal animation: the page already orchestrates
          two, and a third would mean nothing ever settles. */}
      <section className="relative overflow-hidden bg-fog">
        {/* Faint drafting rule — a wash, not a pattern. Keeps the light plate
            from reading as flat card stock after the carbon map above. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(22,24,28,0.05) 1px, transparent 1px)',
            backgroundSize: '4.5rem 100%',
          }}
        />

        <div className="relative mx-auto max-w-[100rem] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          {/* Head sits on the baseline of the row it introduces: label and
              headline left, the count right, one hairline under both. */}
          {/* Below lg: a centred stack. From lg: headline left, note right. */}
          <div className="flex flex-col items-center gap-x-10 gap-y-6 border-b border-ink/20 pb-7 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="min-w-0">
              <TreadKicker className="lg:justify-start">Elsewhere on the site</TreadKicker>
              <h2 className="font-wide mt-6 min-w-0 text-[clamp(2rem,5vw,4.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-ink [overflow-wrap:anywhere]">
                Not what you
                <br />
                came here for?
              </h2>
            </div>
            <p className="max-w-xs font-sans text-base leading-relaxed text-ash">
              Three doors out of this page. The desk stays open either way.
            </p>
          </div>

          {/* Cards. All three share one top line and one size, so photos,
              labels and titles sit level across the row. */}
          <ul className="mt-16 grid list-none grid-cols-1 gap-x-8 gap-y-14 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map(({ to, kicker, title, desc, img, alt }, i) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {/* Plate: the image is inset inside a hairline frame, so the
                      frame stays put while the photograph pushes in on hover. */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-ink/15 bg-ink/5">
                    <img
                      src={img}
                      alt={alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.06]"
                    />
                    {/* Bottom scrim: carries the index number and keeps it legible
                        over whatever part of the photograph sits behind it. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-carbon/85 via-carbon/25 to-transparent"
                    />
                    <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
                      {String(i + 1).padStart(2, '0')} <span className="text-white/35">/ 03</span>
                    </span>
                    {/* Green wipe up from the base — the vertical cousin of the
                        horizontal wipe on the page's buttons. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1 origin-bottom scale-y-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-y-100"
                    />
                  </div>

                  <span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
                    {kicker}
                  </span>

                  <span className="font-wide mt-3 flex items-baseline gap-3 text-2xl font-extrabold uppercase leading-none tracking-tight text-ink transition-colors duration-300 group-hover:text-brand sm:text-[1.75rem]">
                    {title}
                    <Icon.arrow className="h-4 w-4 shrink-0 translate-y-[-0.1em] transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>

                  <span className="mt-4 block max-w-xs font-sans text-[15px] leading-relaxed text-ash">
                    {desc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
