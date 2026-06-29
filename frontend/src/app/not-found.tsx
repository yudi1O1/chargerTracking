import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Route not found</h1>
        <p className="mt-3 text-muted-foreground">The EVision workspace you requested does not exist.</p>
        <Link className="mt-8 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}

