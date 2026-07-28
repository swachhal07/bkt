const products = [
  { name: 'Highway HP', category: 'Passenger Car', desc: 'Smooth, quiet ride for everyday driving.' },
  { name: 'TrailGrip AT', category: 'SUV / 4x4', desc: 'All-terrain grip for on and off road.' },
  { name: 'HaulMax', category: 'Truck & Bus', desc: 'Long mileage under heavy loads.' },
  { name: 'AgriForce', category: 'Agriculture', desc: 'Traction built for the field.' },
  { name: 'CityRide', category: 'Compact', desc: 'Fuel-efficient and city-ready.' },
  { name: 'WinterEdge', category: 'All Season', desc: 'Confident handling in cold conditions.' },
]

export default function Products() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-wide text-4xl font-extrabold text-ink">Our Tyres</h1>
        <p className="mt-3 text-gray-600">A tyre for every vehicle and every road.</p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.name}
            className="overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg"
          >
            <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
              Product image
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                {p.category}
              </span>
              <h3 className="mt-1 text-xl font-semibold text-ink">{p.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
