'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Flame,
  TrendingUp,
  Target,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function StreakGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Back link */}
      <Link
        href="/streaks"
        className="mb-6 inline-flex items-center gap-2 text-body-sm font-medium text-txt-secondary transition-colors hover:text-txt-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Streaks
      </Link>

      {/* Title */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-oracle-md bg-oracle-gold/20">
            <Flame className="h-5 w-5 text-oracle-gold" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-txt-primary sm:text-display-md">
            Streak Engine Guide
          </h1>
        </div>
        <p className="text-body text-txt-secondary">
          Everything you need to understand how OraQL_ detects patterns, what the numbers mean, and how to read the abbreviations.
        </p>
      </div>

      {/* ─── How It Works ─── */}
      <GuideSection icon={Zap} title="How the Streak Engine Works">
        <p>
          The Streak Engine scans every team across every league, looking at their recent match history for repeating patterns.
          It checks multiple markets (goals, corners, cards, clean sheets) across different window sizes (last 3, 5, 10, or 15 matches)
          and different venue filters (home only, away only, or all matches).
        </p>
        <p>
          When the engine finds a pattern that has hit consistently — for example, a team going over 2.5 goals in 8 of their
          last 10 matches — it flags it as an active streak. These streaks are then scored, ranked, and presented to you.
        </p>
        <p>
          The engine runs automatically every day at 6 AM, scanning thousands of teams worldwide. Only patterns that meet
          a minimum threshold (at least 60% hit rate across 3+ consecutive matches) are flagged.
        </p>
      </GuideSection>

      {/* ─── Key Metrics ─── */}
      <GuideSection icon={TrendingUp} title="Key Metrics Explained">
        <TermDef term="Hit Rate" example="85% (8/10)">
          How many of the analysed matches matched the pattern. If a team&apos;s &ldquo;Goals Over 2.5&rdquo; streak shows 8/10,
          it means 8 out of the last 10 matches had more than 2.5 total goals. Higher hit rate = more consistent pattern.
        </TermDef>

        <TermDef term="Streak Length" example="7 consecutive">
          The number of most recent matches IN A ROW where the pattern held without breaking. A streak of 7 means the last 7
          matches all hit — a strong unbroken run. This is different from hit rate because it only counts the consecutive run from
          the most recent match backwards.
        </TermDef>

        <TermDef term="Confidence" example="72%">
          The engine&apos;s overall trust in this pattern continuing. It combines hit rate, streak length, and sample size into one score.
          A 90% hit rate on 3 matches gives lower confidence than a 85% hit rate on 15 matches because more data = more reliable.
        </TermDef>

        <TermDef term="Quality Score" example="Q: 84">
          A composite ranking metric used to order streaks and tickets. Weighs hit rate (40%), streak length (25%), recency (20%),
          and sample size (15%). Higher quality score = more reliable and relevant pattern.
        </TermDef>

        <TermDef term="Window Size" example="Last 10 matches">
          How many recent matches were analysed for this pattern. The engine checks windows of 3, 5, 10, and 15 matches.
          Larger windows give more reliable data but may include older results that are less relevant.
        </TermDef>

        <TermDef term="Venue Filter" example="Home / Away / All venues">
          Whether the pattern was tracked only in home matches, only in away matches, or across all matches.
          Some teams perform very differently at home vs away, so venue-specific streaks can be more meaningful.
        </TermDef>
      </GuideSection>

      {/* ─── Markets ─── */}
      <GuideSection icon={Target} title="Market Types">
        <p>
          A &ldquo;market&rdquo; is a specific outcome the engine tracks. Here are all the markets the engine scans:
        </p>

        <h4 className="mb-3 mt-6 font-display text-body font-semibold text-txt-primary">Goal Markets</h4>
        <MarketRow name="Goals Over X" abbrev="O2.5G" desc="The match total (both teams combined) must be MORE than the line. O2.5G means the match needs 3 or more goals." />
        <MarketRow name="Goals Under X" abbrev="U2.5G" desc="The match total must be FEWER than the line. U2.5G means the match needs 2 or fewer goals." />
        <MarketRow name="Team Goals Over X" abbrev="TO1.5G" desc="This specific team must score MORE than the line. TO1.5G means the team needs 2+ goals themselves." />
        <MarketRow name="Team Goals Under X" abbrev="TU1.5G" desc="This specific team must score FEWER than the line. TU1.5G means the team scores 0 or 1 goals." />
        <MarketRow name="Both Teams to Score" abbrev="BTTS" desc="Both teams must each score at least one goal. The match must not have a team on zero goals." />
        <MarketRow name="No BTTS" abbrev="NoBTTS" desc="At least one team does NOT score. One or both sides finish the match with zero goals." />
        <MarketRow name="Clean Sheet" abbrev="CS" desc="This team concedes zero goals — the opposing team does not score at all." />

        <h4 className="mb-3 mt-6 font-display text-body font-semibold text-txt-primary">Corner Markets</h4>
        <MarketRow name="Corners Over X" abbrev="O9.5C" desc="Total corners in the match (both teams combined) must be MORE than the line. O9.5C means 10+ corners." />
        <MarketRow name="Corners Under X" abbrev="U9.5C" desc="Total corners must be FEWER than the line. U9.5C means 9 or fewer corners in the match." />

        <h4 className="mb-3 mt-6 font-display text-body font-semibold text-txt-primary">Card Markets</h4>
        <MarketRow name="Cards Over X" abbrev="O3.5Cd" desc="Total cards (yellow + red, both teams) must be MORE than the line. O3.5Cd means 4+ cards in the match." />
        <MarketRow name="Cards Under X" abbrev="U3.5Cd" desc="Total cards must be FEWER than the line. U3.5Cd means 3 or fewer cards." />
      </GuideSection>

      {/* ─── Abbreviation Quick Reference ─── */}
      <GuideSection icon={ChevronRight} title="Abbreviation Quick Reference">
        <div className="overflow-hidden rounded-oracle-md border border-warm-sand">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-warm-cream">
                <th className="px-4 py-2.5 text-left font-semibold text-txt-secondary">Abbreviation</th>
                <th className="px-4 py-2.5 text-left font-semibold text-txt-secondary">Full Name</th>
                <th className="px-4 py-2.5 text-left font-semibold text-txt-secondary">What It Means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-sand">
              <AbbrRow abbr="O1.5G" full="Goals Over 1.5" meaning="2 or more total goals in the match" />
              <AbbrRow abbr="O2.5G" full="Goals Over 2.5" meaning="3 or more total goals" />
              <AbbrRow abbr="O3.5G" full="Goals Over 3.5" meaning="4 or more total goals" />
              <AbbrRow abbr="U2.5G" full="Goals Under 2.5" meaning="2 or fewer total goals" />
              <AbbrRow abbr="U3.5G" full="Goals Under 3.5" meaning="3 or fewer total goals" />
              <AbbrRow abbr="TO1.5G" full="Team Over 1.5 Goals" meaning="This team scores 2+ goals" />
              <AbbrRow abbr="TU0.5G" full="Team Under 0.5 Goals" meaning="This team scores 0 goals" />
              <AbbrRow abbr="BTTS" full="Both Teams to Score" meaning="Each team scores at least 1" />
              <AbbrRow abbr="NoBTTS" full="No BTTS" meaning="At least one team doesn't score" />
              <AbbrRow abbr="CS" full="Clean Sheet" meaning="Team concedes 0 goals" />
              <AbbrRow abbr="O9.5C" full="Corners Over 9.5" meaning="10+ total corners in match" />
              <AbbrRow abbr="U8.5C" full="Corners Under 8.5" meaning="8 or fewer total corners" />
              <AbbrRow abbr="O3.5Cd" full="Cards Over 3.5" meaning="4+ total cards in match" />
              <AbbrRow abbr="U4.5Cd" full="Cards Under 4.5" meaning="4 or fewer total cards" />
            </tbody>
          </table>
        </div>
      </GuideSection>

      {/* ─── Reading a Streak Row ─── */}
      <GuideSection icon={Flame} title="How to Read a Streak Row">
        <p>Each streak row on the Streaks page shows:</p>

        <div className="my-4 space-y-3 rounded-oracle-md border border-warm-sand bg-warm-cream/30 p-4">
          <ReadingRow label="Rank" desc="Position in the quality-score ranking. #1 is the strongest pattern." />
          <ReadingRow label="Team Logo + Name" desc="The team this pattern belongs to." />
          <ReadingRow label="League" desc="The domestic league this team competes in." />
          <ReadingRow label="Market + Line" desc="What outcome is being tracked (e.g., Goals Over 2.5). Hover for a full explanation." />
          <ReadingRow label="Venue" desc="Home, Away, or All venues — where this pattern was tracked." />
          <ReadingRow label="Window" desc="How many recent matches were analysed (e.g., Last 10 matches)." />
          <ReadingRow label="Flame Badge" desc="The consecutive streak length — how many matches in a row the pattern held." />
          <ReadingRow label="Percentage" desc="The hit rate — what fraction of the window matches hit this pattern." />
        </div>

        <p>
          Click any streak row to expand it and see detailed stats: the exact hit count, confidence score, quality score,
          the league name, a written summary, and a visual bar showing which recent matches hit (green) or missed (grey).
        </p>
      </GuideSection>

      {/* ─── Suggested Tickets ─── */}
      <GuideSection icon={Shield} title="Understanding Suggested Tickets">
        <p>
          Suggested Tickets are multi-leg bets automatically assembled from the strongest active streaks across different leagues
          and upcoming matches. The engine uses three strategies to build diverse tickets:
        </p>

        <div className="my-4 space-y-3 rounded-oracle-md border border-warm-sand bg-warm-cream/30 p-4">
          <ReadingRow label="Legs" desc="Each leg is one market selection from one match. A 3-LEG ticket means three selections that all need to win." />
          <ReadingRow label="Combined Probability" desc="The estimated chance of ALL legs winning. Calculated by multiplying each leg's individual probability." />
          <ReadingRow label="Avg Confidence" desc="Average engine confidence across all legs in the ticket." />
          <ReadingRow label="Quality Score (Q)" desc="Overall ticket quality combining confidence, probability, diversity, and leg count." />
          <ReadingRow label="Apply to Builder" desc="Adds the ticket's market selections to your Bet Builder so you can review and place the bet." />
        </div>
      </GuideSection>

      {/* ─── A-Z Filter ─── */}
      <GuideSection icon={Target} title="Using the League Filter">
        <p>
          The A-Z grid lets you filter streaks by league. Each letter square represents leagues starting with that letter.
          A gold dot on a letter means there are active streaks in leagues under that letter.
        </p>
        <p>
          Click a letter to open a modal showing all leagues under it, with a search bar at the top for quick lookup.
          Each league shows its country and streak count. Select a league to filter the streak list — the page fetches
          the top 30 streaks specifically for that league from the server.
        </p>
        <p>
          Leagues with 0 streaks are still shown — it means the engine hasn&apos;t found qualifying patterns there yet,
          not that the league is unsupported. Click &ldquo;All&rdquo; to return to the global view.
        </p>
      </GuideSection>

      {/* Footer */}
      <div className="mt-12 border-t border-warm-sand pt-6 text-center">
        <Link
          href="/streaks"
          className="inline-flex items-center gap-2 rounded-oracle-md bg-dark-ink px-6 py-3 text-body-sm font-semibold text-txt-inverse transition-colors hover:bg-dark-charcoal"
        >
          <Flame className="h-4 w-4 text-oracle-gold" />
          Go to Streaks
        </Link>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function GuideSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Flame;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-oracle-gold" />
        <h2 className="font-display text-xl font-semibold tracking-tight text-txt-primary">{title}</h2>
      </div>
      <div className="space-y-3 text-body-sm leading-relaxed text-txt-secondary">{children}</div>
    </section>
  );
}

function TermDef({
  term,
  example,
  children,
}: {
  term: string;
  example: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-oracle-sm border-l-2 border-oracle-gold bg-warm-cream/40 p-3">
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-display text-body font-semibold text-txt-primary">{term}</span>
        <span className="font-mono text-caption text-oracle-gold-dark">{example}</span>
      </div>
      <p className="text-body-sm text-txt-secondary">{children}</p>
    </div>
  );
}

function MarketRow({
  name,
  abbrev,
  desc,
}: {
  name: string;
  abbrev: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-warm-sand/50 py-2.5 last:border-0">
      <span className="w-16 flex-shrink-0 rounded-oracle-sm bg-warm-cream px-2 py-0.5 text-center font-mono text-caption font-bold text-txt-secondary">
        {abbrev}
      </span>
      <div>
        <span className="font-medium text-txt-primary">{name}</span>
        <p className="mt-0.5 text-caption text-txt-tertiary">{desc}</p>
      </div>
    </div>
  );
}

function AbbrRow({
  abbr,
  full,
  meaning,
}: {
  abbr: string;
  full: string;
  meaning: string;
}) {
  return (
    <tr className="hover:bg-warm-cream/40">
      <td className="px-4 py-2 font-mono font-bold text-oracle-gold-dark">{abbr}</td>
      <td className="px-4 py-2 font-medium text-txt-primary">{full}</td>
      <td className="px-4 py-2 text-txt-secondary">{meaning}</td>
    </tr>
  );
}

function ReadingRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-32 flex-shrink-0 font-medium text-txt-primary">{label}</span>
      <span className="text-txt-secondary">{desc}</span>
    </div>
  );
}
