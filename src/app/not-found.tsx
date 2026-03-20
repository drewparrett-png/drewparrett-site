import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <h1 className="text-6xl font-bold tracking-tighter">404</h1>
      <p className="mt-4 text-[var(--muted)] text-lg">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 text-sm text-white underline underline-offset-4 hover:text-[var(--label-project)]"
      >
        Back to home
      </Link>
    </div>
  );
}
