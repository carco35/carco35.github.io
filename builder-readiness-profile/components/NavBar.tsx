import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="no-print border-b border-border bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="container-narrow flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-ink text-lg">
          Builder Readiness Profile
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink/70">
          <Link href="/build" className="hover:text-ink transition-colors">
            Build
          </Link>
          <Link href="/profile" className="hover:text-ink transition-colors">
            Profile
          </Link>
          <Link href="/opportunities" className="hover:text-ink transition-colors">
            Opportunities
          </Link>
          <Link href="/export" className="hover:text-ink transition-colors">
            Export
          </Link>
        </nav>
      </div>
    </header>
  );
}
