import { useEffect, useRef, useState } from 'react'

/* ────────────────────────────────────────────────────────────────────
   Machine picker for the tyre finder — a custom listbox in place of the
   native <select>, whose open list can't be styled.

   Trigger: the current choice and a chevron, sized to sit in the finder bar.
   Panel:   white card under the bar; Agriculture and OTR side by side from
            sm (stacked on phones), each opening with "All … tyres", every
            option with its live tyre count; the chosen one turns green
            with a slanted tread-block marker, and hovering or tabbing onto
            any option previews that same green treatment.
   Keys:    ↑/↓ move, Home/End jump, Enter/Space choose, Esc closes and
            hands focus back to the trigger. A click outside also closes.

   Values match Products.jsx: '' = everything, 'sector:<id>' = a whole
   sector, anything else = a machine group id.
   ──────────────────────────────────────────────────────────────────── */

/* Selected marker: one slanted tread block in brand green, the same shape
   as the site's section kicker, in place of a generic tick. */
function Option({ v, label, strong = false, value, countFor, choose }) {
  const on = v === value
  const n = countFor(v)
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={on}
        data-value={v}
        onClick={() => choose(v)}
        className={`group/opt relative flex w-full items-center gap-3 rounded-lg py-2 pl-5 pr-3 text-left text-[15px] outline-none transition-colors duration-200 hover:text-brand focus-visible:text-brand ${
          on ? 'text-brand' : n ? 'text-ink' : 'text-ash/60'
        } ${strong || on ? 'font-semibold' : ''}`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-1.5 top-1/2 h-3.5 w-1.5 -translate-y-1/2 -skew-x-[20deg] rounded-[1px] bg-brand transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none ${
            on
              ? 'opacity-100'
              : 'scale-y-50 opacity-0 group-hover/opt:scale-y-100 group-hover/opt:opacity-100 group-focus-visible/opt:scale-y-100 group-focus-visible/opt:opacity-100'
          }`}
        />
        <span className="flex-1">{label}</span>
        <span
          className={`text-sm tabular-nums transition-colors duration-200 ${
            on ? 'text-brand' : 'text-ash group-hover/opt:text-brand group-focus-visible/opt:text-brand'
          }`}
        >
          {n}
        </span>
      </button>
    </li>
  )
}

export default function MachinePicker({ value, onChange, columns, labelFor, countFor }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const trigger = useRef(null)
  const list = useRef(null)

  const options = () => Array.from(list.current?.querySelectorAll('[role="option"]') ?? [])

  /* On open, focus the chosen option (or the first). */
  useEffect(() => {
    if (!open) return
    const opts = options()
    ;(opts.find((o) => o.dataset.value === value) ?? opts[0])?.focus()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps -- focus once per opening

  /* Click outside closes. */
  useEffect(() => {
    if (!open) return
    const away = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  const choose = (v) => {
    onChange(v)
    setOpen(false)
    trigger.current?.focus()
  }

  const onKey = (e) => {
    const opts = options()
    const i = opts.indexOf(document.activeElement)
    const go = (n) => {
      e.preventDefault()
      opts[(n + opts.length) % opts.length]?.focus()
    }
    if (e.key === 'ArrowDown') go(i + 1)
    else if (e.key === 'ArrowUp') go(i - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(opts.length - 1)
    else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault()
      setOpen(false)
      if (e.key === 'Escape') trigger.current?.focus()
    }
  }

  const pass = { value, countFor, choose }

  return (
    <div ref={root} className="contents">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className={`group flex h-14 w-full items-center gap-2 pl-6 pr-5 text-left outline-none transition-colors focus-visible:text-brand sm:w-52 ${
          open || value ? 'text-ink' : 'text-ash hover:text-ink'
        }`}
      >
        <span className="sr-only">Machine: </span>
        <span className="flex-1 truncate font-sans text-[15px] font-medium">{labelFor(value)}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-brand' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          ref={list}
          onKeyDown={onKey}
          className="anim-pop absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white text-left shadow-[0_20px_44px_-22px_rgba(12,13,15,0.32)] sm:left-auto sm:w-[38rem]"
        >
          <ul role="listbox" aria-label="Machine" className="max-h-[min(75vh,32rem)] overflow-y-auto overscroll-contain">
            <li className="border-b border-ink/10 p-2">
              <ul role="group" aria-label="Everything">
                <Option v="" label="All machines" strong {...pass} />
              </ul>
            </li>
            <li className="grid sm:grid-cols-2 sm:divide-x sm:divide-ink/10">
              {columns.map((c, i) => (
                <div key={c.id} className={`p-2 pb-3 ${i ? 'border-t border-ink/10 sm:border-t-0' : ''}`}>
                  <p className="px-5 pb-2 pt-3 font-wide text-sm font-extrabold uppercase tracking-tight text-ink">{c.name}</p>
                  <ul role="group" aria-label={c.name}>
                    <Option v={`sector:${c.id}`} label={c.allLabel} strong {...pass} />
                    {c.groups.map((g) => (
                      <Option key={g.id} v={g.id} label={g.name} {...pass} />
                    ))}
                  </ul>
                </div>
              ))}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
