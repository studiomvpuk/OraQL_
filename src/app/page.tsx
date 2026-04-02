import Link from 'next/link';
import {
  Trophy,
  ArrowRight,
  BarChart3,
  Brain,
  Layers,
  Shield,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-warm-sand/60 bg-warm-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-oracle-sm bg-dark-ink">
              <Trophy className="h-5 w-5 text-oracle-gold" />
            </div>
            <span className="font-display text-display-sm tracking-tight text-dark-ink">
              OraQL_
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-body-sm font-medium text-txt-secondary transition-colors hover:text-txt-primary"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center gap-2 rounded-oracle-sm bg-dark-ink px-4 py-2 text-body-sm font-semibold text-txt-inverse transition-all hover:bg-dark-charcoal"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero (Warm Cream Surface) ─── */}
      <section className="relative overflow-hidden bg-warm-cream pt-32 pb-20">
        <span
          className="pointer-events-none absolute -right-16 -top-20 select-none font-display font-bold text-warm-sand"
          style={{ fontSize: '32rem', lineHeight: '0.8', opacity: 0.5 }}
        >
          O
        </span>
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-warm-stone bg-warm-white px-4 py-1.5 text-caption font-semibold uppercase tracking-widest text-oracle-gold-dark">
            <Zap className="h-3 w-3" />
            Probability-Driven Intelligence
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-display-xl tracking-tight text-dark-ink">
            Smarter bets start with{' '}
            <span className="text-oracle-gradient">better data.</span>
          </h1>

          <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-txt-secondary">
            OraQL_ analyses every market, every match — computing probabilities from
            real match data, surfacing value bets, and explaining its reasoning in
            plain language.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center gap-2 rounded-oracle-md bg-oracle-gold px-6 py-3 font-display text-body-lg font-semibold text-dark-ink transition-all hover:bg-oracle-gold-light hover:shadow-glow"
            >
              Start Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-oracle-md border border-warm-stone bg-warm-white px-6 py-3 font-display text-body-lg font-medium text-txt-primary transition-all hover:bg-warm-cream hover:border-warm-taupe"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-body-sm text-txt-tertiary">
            <span>
              <strong className="text-txt-secondary">10+</strong> leagues covered
            </span>
            <span>
              <strong className="text-txt-secondary">6</strong> market categories
            </span>
            <span>
              <strong className="text-txt-secondary">Poisson</strong> probability engine
            </span>
          </div>
        </div>
      </section>

      {/* ─── How It Works (Dark Ink Surface) ─── */}
      <section className="bg-dark-ink py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span
            className="pointer-events-none absolute right-0 select-none font-display font-bold text-white"
            style={{ fontSize: '20rem', lineHeight: '0.8', opacity: 0.03 }}
          >
            H
          </span>
          <p className="text-caption font-semibold uppercase tracking-widest text-oracle-gold">
            How It Works
          </p>
          <h2 className="mt-2 font-display text-display-md tracking-tight text-txt-inverse">
            From data to decisions in three steps
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: BarChart3,
                title: 'Ingest & Analyse',
                desc: 'OraQL_ pulls fixtures, stats, lineups, and odds from live data providers — then computes weighted averages across the last 10 matches.',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Compute Probabilities',
                desc: 'A Poisson-based engine calculates over/under, match result, corners, cards, and BTTS probabilities with recency weighting and injury adjustments.',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Surface Value',
                desc: 'OraQL_ compares its computed probability against bookmaker implied odds — flagging bets with 10%+ value gaps and explaining why.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-oracle-lg border border-dark-graphite bg-dark-charcoal p-6 transition-all hover:border-dark-slate"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-caption font-bold text-oracle-gold">
                    {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-oracle-sm bg-oracle-gold/15">
                    <item.icon className="h-5 w-5 text-oracle-gold" />
                  </div>
                </div>
                <h3 className="font-display text-heading tracking-tight text-txt-inverse">
                  {item.title}
                </h3>
                <p className="mt-2 text-body-sm leading-relaxed text-txt-inverse-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features (Warm White Surface) ─── */}
      <section className="bg-warm-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-caption font-semibold uppercase tracking-widest text-oracle-gold-dark">
            Features
          </p>
          <h2 className="mt-2 font-display text-display-md tracking-tight">
            Everything you need to bet smarter
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: 'OraQL_ Picks',
                desc: 'Ranked predictions across every match, sorted by confidence — the top picks surfaced automatically.',
              },
              {
                icon: Layers,
                title: 'Bet Builder',
                desc: 'Combine selections from multiple events. See your combined probability update in real time.',
              },
              {
                icon: Brain,
                title: 'Transparent Reasoning',
                desc: 'Every probability comes with a plain-language explanation — stats, trends, and injury context.',
              },
              {
                icon: Zap,
                title: 'Value Bet Detection',
                desc: 'Automatic detection of markets where OraQL_\'s probability diverges 10%+ from bookmaker odds.',
              },
              {
                icon: BarChart3,
                title: 'Market Analysis',
                desc: 'Goals, corners, cards, match result, BTTS — six market categories analysed per event.',
              },
              {
                icon: Shield,
                title: 'Real-Time Updates',
                desc: 'Probabilities refresh when lineups are confirmed. Live push via WebSocket — no manual refresh.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-oracle-md border border-warm-sand bg-warm-cream/50 p-6 transition-all hover:border-warm-stone hover:shadow-card"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-oracle-sm bg-oracle-gold/10">
                  <feature.icon className="h-5 w-5 text-oracle-gold-dark" />
                </div>
                <h3 className="font-display text-heading tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-body-sm leading-relaxed text-txt-secondary">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA (Dark Charcoal Surface) ─── */}
      <section className="relative overflow-hidden bg-dark-charcoal py-20">
        <span
          className="pointer-events-none absolute -left-10 -bottom-10 select-none font-display font-bold text-white"
          style={{ fontSize: '20rem', lineHeight: '0.8', opacity: 0.03 }}
        >
          G
        </span>
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-display-md tracking-tight text-txt-inverse">
            Ready to see the numbers?
          </h2>
          <p className="mt-4 text-body-lg text-txt-inverse-2">
            Create your free account and start exploring OraQL_&apos;s probability engine today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center gap-2 rounded-oracle-md bg-oracle-gold px-6 py-3 font-display text-body-lg font-semibold text-dark-ink transition-all hover:bg-oracle-gold-light hover:shadow-glow"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer (Dark Ink Surface) ─── */}
      <footer className="border-t border-dark-graphite bg-dark-ink py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-oracle-gold" />
            <span className="font-display text-body-sm font-semibold text-txt-inverse">
              OraQL_
            </span>
          </div>
          <p className="text-caption text-txt-inverse-2">
            OraQL_ does not place bets or handle money. Use responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
