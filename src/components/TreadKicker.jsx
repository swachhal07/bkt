/* Section label marker used across the site (chosen from /kicker-lab, option
   2): three short slanted bars in the logo's three greens — like tread
   blocks — in front of the label. `onDark` switches the label to the light
   logo green for carbon sections; `align` centres it or sits it left. */
export default function TreadKicker({ children, onDark = false, align = 'center', className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}>
      <span className="flex gap-1" aria-hidden="true">
        <span className="h-3.5 w-1.5 -skew-x-[20deg] rounded-[1px] bg-brand-glow" />
        <span className="h-3.5 w-1.5 -skew-x-[20deg] rounded-[1px] bg-[#22b14c]" />
        <span className="h-3.5 w-1.5 -skew-x-[20deg] rounded-[1px] bg-brand" />
      </span>
      <span
        className={`font-sans text-sm font-bold uppercase tracking-[0.25em] ${onDark ? 'text-brand-glow' : 'text-brand'}`}
      >
        {children}
      </span>
    </div>
  )
}
