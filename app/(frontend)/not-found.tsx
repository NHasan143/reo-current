import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-ink md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-neutral-600">
        The story you&apos;re looking for may have moved or is no longer
        available.
      </p>
      <Link href="/" className="btn-brand mt-8">
        Back to the front page
      </Link>
    </div>
  );
}
