import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <section className="container-narrow px-6 pt-20 pb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wide mb-4">
            For young builders
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight max-w-2xl">
            Your track record is real. Now it&apos;s legible.
          </h1>
          <p className="mt-6 text-lg text-ink/70 max-w-xl leading-relaxed">
            Turn the projects you&apos;ve shipped, the money habits you&apos;ve built, and the
            people who&apos;ll vouch for you into a structured profile — then use it to apply to
            real funding built for young entrepreneurs.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/build"
              className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-white font-medium hover:bg-accent-light transition-colors"
            >
              Build my profile
            </Link>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container-narrow px-6 py-16 grid gap-12 sm:grid-cols-3">
            <div>
              <span className="text-xs font-mono text-ink/40">01</span>
              <h2 className="mt-3 text-lg font-semibold text-ink">The gap</h2>
              <p className="mt-3 text-sm text-ink/65 leading-relaxed">
                Young builders generate real proof of trustworthiness — completed projects,
                responsible money habits, people who&apos;ll vouch for them — that no traditional
                system captures. Formal credit assumes a financial history most young people
                simply haven&apos;t had time to build yet.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono text-ink/40">02</span>
              <h2 className="mt-3 text-lg font-semibold text-ink">What this does</h2>
              <p className="mt-3 text-sm text-ink/65 leading-relaxed">
                Organizes that real track record — projects, skills, optional bank activity, and
                vouches from people who know your work — into a structured profile, then helps
                you apply to real funding opportunities built for young entrepreneurs.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono text-ink/40">03</span>
              <h2 className="mt-3 text-lg font-semibold text-ink">What this isn&apos;t</h2>
              <p className="mt-3 text-sm text-ink/65 leading-relaxed">
                Not a credit score. Not a credit report. Not an automatic application. It&apos;s a
                tool to help you tell your own story clearly, backed by real evidence, so you can
                apply yourself with confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-white">
          <div className="container-narrow px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-ink">Ready to see what your record adds up to?</h2>
            <p className="mt-3 text-ink/60">Takes about 10 minutes. Bank connection is optional.</p>
            <Link
              href="/build"
              className="mt-8 inline-flex items-center rounded-md bg-accent px-6 py-3 text-white font-medium hover:bg-accent-light transition-colors"
            >
              Build my profile
            </Link>
          </div>
        </section>

        <footer className="no-print border-t border-border">
          <div className="container-narrow px-6 py-8 text-xs text-ink/40">
            Builder Readiness Profile is an independent assessment tool, not a credit bureau
            product. It does not report to or interact with any credit bureau.
          </div>
        </footer>
      </main>
    </>
  );
}
