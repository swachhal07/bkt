/* Our own feature pictograms — drawn for this site, not BKT's. One 24×24
   line glyph per feature label; colour and container come from the style
   that renders them — the site uses FeatureNut below. */

const G = {
  'High Load Capacity': (
    <>
      <path d="M9 6a3 3 0 0 1 6 0" />
      <path d="M6.5 9h11L19 20H5z" />
      <path d="M12 12v4.5M10 14.5l2 2 2-2" />
    </>
  ),
  'Handling & Comfort': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 14.5V21M9.6 11.3 3.4 9.8M14.4 11.3l6.2-1.5" />
    </>
  ),
  'Self-Cleaning': (
    <>
      <path d="M11 4s-5 6-5 10a5 5 0 0 0 10 0c0-4-5-10-5-10z" />
      <path d="M19 3v4M17 5h4" />
      <path d="M9 14a2 2 0 0 0 2 2" />
    </>
  ),
  'Reduced Soil Compaction': (
    <>
      <path d="M3 17h18M6 20.5h12" />
      <path d="M12 17v-5" />
      <path d="M12 12c0-3 2-5 6-5 0 3-2 5-6 5z" />
      <path d="M12 13c0-2.5-1.7-4-4.5-4 0 2.5 1.7 4 4.5 4z" />
    </>
  ),
  'Fuel Economy': (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M3 21h14M8 7.5h4" />
      <path d="M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3" />
    </>
  ),
  Traction: <path d="M4 6.5 8 12l-4 5.5M10 6.5l4 5.5-4 5.5M16 6.5l4 5.5-4 5.5" />,
  'VF Technology': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M7 9.5l2 5 2-5M14 14.5v-5h3.5M14 12h2.5" />
    </>
  ),
  'Low Rolling Resistance': (
    <>
      <circle cx="15" cy="12" r="6" />
      <circle cx="15" cy="12" r="1.5" />
      <path d="M2 9h5M3.5 12H7M2 15h5" />
    </>
  ),
  'Strong Casing': (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  Durability: <path d="M7.5 9a3 3 0 1 0 0 6c2.5 0 6.5-6 9-6a3 3 0 1 1 0 6c-2.5 0-6.5-6-9-6z" />,
  'Heavy Duty': <path d="M6 7v10M18 7v10M3 9.5v5M21 9.5v5M6 12h12" />,
  'Cut and Chip Resistance': (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </>
  ),
  'Cut Resistance': (
    <>
      <path d="M12 3l7 7-7 11-7-11z" />
      <path d="M5 10h14M9.5 3.6 12 10l2.5-6.4" />
    </>
  ),
  Stability: (
    <>
      <path d="M3 20h18M12 20V6M5 9h14" />
      <path d="M5 9l-2.5 5h5zM19 9l-2.5 5h5z" />
      <circle cx="12" cy="4.5" r="1.5" />
    </>
  ),
  'Heat Resistance': (
    <>
      <path d="M9 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z" />
      <path d="M11 9v7.5" />
      <path d="M17.5 5c1 1 1 2 0 3s-1 2 0 3M20.5 5c1 1 1 2 0 3s-1 2 0 3" />
    </>
  ),
  'High Puncture Resistance': (
    <>
      <path d="M12 3v8M9.5 3h5M12 11l-1 2.5h2z" />
      <path d="M3.5 16.5h17M6 20h12" />
    </>
  ),
  'Excellent Flotation': (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M3 15c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />
      <path d="M3 19c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />
    </>
  ),
  Comfort: (
    <>
      <path d="M20 4C11 4 6 9 6 17v3" />
      <path d="M6 17c6 0 11-3 14-13" />
      <path d="M10 13h5M8.5 16h3" />
    </>
  ),
}

export const featureGlyphNames = Object.keys(G)

export function FeatureGlyph({ name, className = 'h-8 w-8', strokeWidth = 1.75 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {G[name] || <circle cx="12" cy="12" r="8" />}
    </svg>
  )
}

/* Chosen treatment (icon lab G): the glyph inside a pale-green hexagon with
   a green outline, shaped like a wheel nut. `size` is the hexagon's edge box. */
export function FeatureNut({ name, size = '4.5rem', glyph = 'h-8 w-8' }) {
  return (
    <span
      className="nut relative inline-flex shrink-0 items-center justify-center text-brand"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 72 72" className="nut-hex absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          d="M36 4 64 20v32L36 68 8 52V20z"
          fill="#eaf1ea"
          stroke="#007735"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <FeatureGlyph name={name} className={`nut-glyph relative ${glyph}`} />
    </span>
  )
}
