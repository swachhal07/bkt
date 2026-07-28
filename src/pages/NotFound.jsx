import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-8 rounded-md bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Back to Home
      </Link>
    </section>
  )
}
