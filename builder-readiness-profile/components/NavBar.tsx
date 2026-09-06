import Link from 'next/link';

export default function NavBar({ sticky = true }: { sticky?: boolean }) {
  return (
    <header
      className={`no-print border-b border-border bg-paper/95 backdrop-blur z-10 ${
        sticky ? 'sticky top-0' : ''
      }`}
    >
      <div className="container-narrow flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
        <Link href="/" className="font-semibold tracking-tight text-ink text-lg">
          Builder Readiness Profile
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink/70 flex-wrap">
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
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <Link
            href="/concept/peer-lending"
            className="inline-flex items-center gap-2 text-concept hover:text-concept-light transition-colors font-medium"
          >
            Concept: Peer Trust Lending
            <span className="inline-block rounded-full bg-concept/10 border border-concept/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-concept">
              Vision Demo
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
