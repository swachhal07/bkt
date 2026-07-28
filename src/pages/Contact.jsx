import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import tyreDetail from '../assets/tyre-detail.webp'
import bktTruck from '../assets/bkt-truck.webp'
import tractorField from '../assets/tractor-field.webp'

/* NOTE: phone, WhatsApp and address are placeholders — swap for the client's
   real details when available. Email (info@bkttyres.com) is the working address,
   consistent with the footer. The enquiry form composes a mailto to that address;
   wire `handleSubmit` to a real form endpoint (Formspree / server route) when ready. */
const PHONE_DISPLAY = '+977 00-000 0000'
const PHONE_HREF = '+97700000000'
const WHATSAPP_HREF = '97700000000'
const EMAIL = 'info@bkttyres.com'
const ADDRESS = 'Kathmandu, Nepal'

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
  whatsapp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.4-8.23 8.4Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.65.3c-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.19 3.7.59.26 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  ),
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
}

/* Green underline that wipes in under a focused field */
const focusRule = (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out peer-focus:scale-x-100"
  />
)

/* Required-field marker. Square, not a disc: every other marker on this page
   is a square, and the disc was the form's only rounded mark. */
const Req = () => (
  <span className="ml-1.5 inline-block h-1.5 w-1.5 bg-brand align-middle" aria-hidden="true" />
)

/* Field label. Deliberately quiet and in the body face: an earlier pass set
   every label, option and footnote in letterspaced mono caps, and with a dozen
   of them stacked the sheet flattened into one texture with no hierarchy left
   to read. Mono caps are the accent on this page — the document strip, the
   section legends — so they are spent on those and nowhere else. What should
   carry weight in a form is the answer, not the caption above it. */
const FieldLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block font-sans text-sm text-ash">
    {children}
  </label>
)

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

/* Visiting facts for the closing site plan. The notes are deliberate: until the
   client's real street address and phone line land, saying so beats dressing a
   placeholder up as live data. Drop the note when the value becomes real. */
const visitFacts = [
  { label: 'Address', value: ADDRESS, note: 'Pinned on the map — street address to confirm' },
  { label: 'Opening hours', value: 'Sun–Fri · 09:00–18:00', note: 'Closed Saturday' },
  { label: 'Phone', value: PHONE_DISPLAY, note: 'Line to be confirmed' },
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

const REQUIRED_FIELDS = ['name', 'email', 'message']

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: enquiryTypes[0],
    message: '',
  })
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
    if (!form.message.trim()) next.message = 'Let us know how we can help.'
    else if (form.message.trim().length < 10) next.message = 'A little more detail helps us help you.'
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

    const subject = `Website enquiry — ${form.type}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone.trim() && `Phone: ${form.phone}`,
      `Enquiry type: ${form.type}`,
      '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setSubmitted(true)
    requestAnimationFrame(() => successRef.current?.focus())
  }

  /* Ruled field: no box, just a hairline that thickens in brand green on focus.
     `block` matters — an inline-block field leaves a baseline gap under it, which
     would drop the green focus rule below the hairline as a second thin line. */
  const fieldCls = (hasError) =>
    `peer block w-full appearance-none rounded-none border-0 border-b bg-transparent px-0 pb-2.5 pt-1.5 font-sans text-[17px] text-ink transition-colors duration-300 placeholder:text-ink/25 focus:outline-none ${
      hasError ? 'border-rust' : 'border-ink/25 focus:border-brand/60'
    }`


  const filled = REQUIRED_FIELDS.filter((k) => form[k].trim()).length

  return (
    <>
      {/* ══ SHEET: masthead + enquiry form ════════════════════════════ */}
      {/* `main` in App.jsx already clears the fixed navbar, so the document
          strip sits flush beneath it — no extra top padding here. */}
      <section className="relative overflow-hidden bg-white">
        {/* ── Document header strip ── */}
        <div className="relative border-y border-ink/12">
          <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink">
              BKT Tyres <span className="text-ash">/</span> Customer enquiry
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-ash sm:block">
              Form WEB–CTC–01
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
              <span className="h-1.5 w-1.5 animate-pulse bg-brand" aria-hidden="true" />
              Desk open
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
          {/* ── Masthead: headline, lead copy and spec block share one screen.
                 Two columns split 7/5 on the same grid the form below uses. ── */}
          <div className="grid min-h-[calc(100svh-8.25rem)] items-center gap-x-10 gap-y-12 py-10 sm:py-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {/* Same marker Home, About and Blog use: dot and a rule fading
                  into the label on each side. */}
              <div className="anim-rise flex items-center gap-4">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand" />
                </span>
                <span className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-brand">
                  Contact desk
                </span>
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
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

              <p className="anim-rise mt-8 max-w-xl font-sans text-base leading-relaxed text-ash sm:text-lg" style={{ animationDelay: '420ms' }}>
                Sizing advice, a fleet quote, or a dealership enquiry — fill in the
                sheet below and it lands with the person who can actually answer it.
                Genuine BKT stock, straight answers, no runaround.
              </p>

              <div className="anim-rise mt-8 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ animationDelay: '520ms' }}>
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="group inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon.phone className="h-4 w-4" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_HREF}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon.whatsapp className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Spec block */}
            <div className="anim-rise lg:col-span-5 lg:border-l lg:border-ink/12 lg:pl-10" style={{ animationDelay: '620ms' }}>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ash">
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

          {/* ── Enquiry sheet ── */}
          <div className="relative reveal border-t border-ink/20 pb-24 pt-16 sm:pb-32">
            {/* Heading sits on its own grid row so the side rail can centre
                against the notebook itself, not against heading + notebook. */}
            <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/20 pb-4 lg:col-span-7 lg:row-start-1">
                <h2 className="font-wide text-3xl font-extrabold uppercase leading-none tracking-tight text-ink sm:text-4xl">
                  Enquiry sheet
                </h2>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                  <span className="h-1.5 w-1.5 bg-brand" aria-hidden="true" />
                  Required
                </span>
              </div>

              {/* Form column — no panel: the fields are ruled straight onto the
                  page, kept compact so the sheet reads as a form, not a slab. */}
              <div className="lg:col-span-7 lg:row-start-2">
                {submitted ? (
                  <div ref={successRef} tabIndex={-1} className="outline-none">
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
                        setForm({ name: '', email: '', phone: '', type: enquiryTypes[0], message: '' })
                      }}
                      className="group mt-8 inline-flex items-center gap-3 border-b-2 border-ink/15 pb-1.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-brand hover:text-brand"
                    >
                      Start a new sheet
                      <Icon.arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name + phone */}
                    <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-8">
                      <div>
                        <FieldLabel htmlFor="field-name">
                          Name
                          <Req />
                        </FieldLabel>
                        <div className="relative mt-2">
                          <input
                            id="field-name"
                            type="text"
                            autoComplete="name"
                            value={form.name}
                            onChange={update('name')}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'err-name' : undefined}
                            className={fieldCls(errors.name)}
                          />
                          {focusRule}
                        </div>
                        {errors.name && (
                          <p id="err-name" className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-rust">
                            ! {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <FieldLabel htmlFor="field-phone">
                          Phone <span className="text-ink/35">(optional)</span>
                        </FieldLabel>
                        <div className="relative mt-2">
                          <input
                            id="field-phone"
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={update('phone')}
                            className={fieldCls(false)}
                          />
                          {focusRule}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mt-7">
                      <FieldLabel htmlFor="field-email">
                        Email
                        <Req />
                      </FieldLabel>
                      <div className="relative mt-2">
                        <input
                          id="field-email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={update('email')}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'err-email' : undefined}
                          className={fieldCls(errors.email)}
                        />
                        {focusRule}
                      </div>
                      {errors.email && (
                        <p id="err-email" className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-rust">
                          ! {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Nature of job. Two versions failed here for opposite
                        reasons: soft pills, the only rounded thing on a page of
                        right angles, and then a hairline grid, which left a
                        dead sixth cell because there are five options and no
                        column count divides them. Flow-laid squared tabs answer
                        both — the corners match the rest of the sheet, and
                        content-width tabs wrap to whatever is there, so five
                        options never leave a hole. */}
                    <fieldset className="mt-8">
                      <legend className="font-sans text-sm text-ash">Nature of job</legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {enquiryTypes.map((t) => {
                          /* Checked state is driven from React rather than from
                             peer-checked: the label's span is the input's only
                             sibling, so peer-* cannot reach anything nested
                             inside it. */
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
                                className={`block border px-4 py-2 font-sans text-[13px] transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
                                  active
                                    ? 'border-brand bg-brand text-white'
                                    : 'border-ink/20 text-ash hover:border-ink/45 hover:text-ink'
                                }`}
                              >
                                {t}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>

                    {/* Message */}
                    <div className="mt-8">
                      <FieldLabel htmlFor="field-message">
                        Message — machine, size, and where it works
                        <Req />
                      </FieldLabel>
                      <div className="relative mt-2">
                        <textarea
                          id="field-message"
                          rows={4}
                          value={form.message}
                          onChange={update('message')}
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? 'err-message' : undefined}
                          className={`${fieldCls(errors.message)} resize-y leading-relaxed`}
                        />
                        {focusRule}
                      </div>
                      {errors.message && (
                        <p id="err-message" className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-rust">
                          ! {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Completion, as a single hairline filling along the top
                        edge of the sign-off bar. The rail's standalone "0/3"
                        left a hole in the column; a labelled three-cell strip
                        in its place just added a third stacked band saying what
                        the field markers already say. One rule loading up is
                        the whole message, and it rhymes with the green rule
                        that wipes in under a focused field. */}
                    <div className="mt-10 h-[3px] w-full bg-ink/10" aria-hidden="true">
                      <span
                        className="block h-full bg-brand transition-[width] duration-700 ease-out"
                        style={{ width: `${(filled / REQUIRED_FIELDS.length) * 100}%` }}
                      />
                    </div>

                    {/* Sign-off — full-width bar, green wipes across on hover. */}
                    <button
                      type="submit"
                      className="group relative flex w-full items-center justify-between overflow-hidden bg-ink px-6 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-8"
                    >
                      <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100" />
                      <span className="font-display relative text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                        Submit enquiry
                      </span>
                      <span className="relative flex items-center gap-4">
                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/50 sm:block">
                          {filled === 3 ? 'Ready to send' : `${3 - filled} to fill`}
                        </span>
                        <Icon.arrow className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </button>

                    {/* Set on the sheet's left margin rather than centred under
                        the bar, where it hung as a stray line of prose. */}
                    <p className="mt-4 font-sans text-sm text-ash">
                      Typically answered within one business day.
                    </p>
                  </form>
                )}
              </div>

              {/* Side rail — the process, and nothing else. It used to open on
                  a standalone progress widget: a 60px "0/3" with a bar beside
                  it and a stretch of empty column beneath, which is what made
                  this half of the sheet read as unfinished. That readout now
                  sits on the form where the fields it counts are, and the three
                  steps are set at a scale that fills the column on their own.
                  Stretches both grid rows so its divider runs the form's
                  length. */}
              <aside className="mt-10 lg:col-span-5 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-l lg:border-ink/12 lg:pl-10">
                <span className="block border-b border-ink/20 pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
                  What happens next
                </span>

                {/* The index carries the weight, the title stays in the body
                    face. Setting these titles in wide caps as well put three
                    more shouting lines next to a heading that is already
                    shouting, which is half of why the sheet read as flat. */}
                <ol className="divide-y divide-ink/10">
                  {steps.map((s) => (
                    <li key={s.n} className="flex gap-6 py-7">
                      <span className="font-display text-3xl font-bold leading-none text-brand tabular-nums">
                        {s.n}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-sans text-[15px] font-bold text-ink">{s.title}</h3>
                        <p className="mt-2 max-w-[38ch] font-sans text-sm leading-relaxed text-ash">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Footnote, labelled the way the spec rows above it are, so it
                    ends the rail on the page's own vocabulary instead of on a
                    loose sentence. */}
                <div className="border-t border-ink/20 pt-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
                    Your details
                  </span>
                  <p className="mt-3 max-w-[42ch] font-sans text-sm leading-relaxed text-ash">
                    We never pass your details on, and we don&rsquo;t run a mailing list.
                    One enquiry, one reply.
                  </p>
                </div>
              </aside>
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
                  36px floor keeps "SHOWROOM" on one line at 320px. */}
              {/* Brand green (#007735), matching the masthead's "we'll fit it."
                  On carbon that's 3.42:1 — under AA for body copy, but over the 3:1
                  large-text threshold, which this clears at 36px+ extrabold. Don't
                  reuse this pairing at body sizes; use brand-glow there. */}
              <h2 className="font-wide min-w-0 text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-white [overflow-wrap:anywhere]">
                Find the <span className="text-brand">showroom</span>
              </h2>

              <p className="mt-7 max-w-lg font-sans text-base leading-relaxed text-white/65 sm:text-lg">
                We&rsquo;re inside the Ring Road, in Kathmandu. Bring the tyre size
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
                    className="grid gap-x-6 gap-y-1 border-b border-white/12 py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
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
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
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
                  title={`Map showing the BKT Tyres showroom in ${ADDRESS}`}
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
                  Pin marks the showroom
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
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-ink/20 pb-7">
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand" />
                </span>
                <span className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-brand">
                  Elsewhere on the site
                </span>
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
              </div>
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

          {/* Cards. The middle column drops on wide screens so the row reads as
              a stagger rather than three matching boxes; `items-start` is what
              lets a single card carry a top offset without dragging its
              neighbours down with it. */}
          <ul className="mt-16 grid list-none grid-cols-1 gap-x-8 gap-y-14 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
            {destinations.map(({ to, kicker, title, desc, img, alt }, i) => (
              <li key={to} className={i === 1 ? 'lg:mt-20' : i === 2 ? 'lg:mt-10' : ''}>
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
