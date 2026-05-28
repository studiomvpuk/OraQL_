'use client';

import { useState } from 'react';
import { Layers, X, Copy, Check, Trash2, ChevronUp } from 'lucide-react';
import { cn, formatProbability } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge';
import { useBuilderStore } from '@/stores/builder.store';

export function BuilderBar() {
  const { selections, count, combinedProbability, remove, clear, exportText } =
    useBuilderStore();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExportText, setShowExportText] = useState<string | null>(null);

  if (count === 0) return null;

  const handleExport = async () => {
    try {
      const text = await exportText();
      // Try clipboard first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        // Fallback: show the text so user can copy manually
        setShowExportText(text);
      }
    } catch {
      // If clipboard fails, try the legacy approach
      try {
        const text = await exportText();
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Last resort: show text in a prompt-like overlay
        const text = await exportText().catch(() => null);
        if (text) setShowExportText(text);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 animate-slide-up lg:left-64">
      {/* Expanded panel */}
      {expanded && (
        <div className="max-h-[50vh] overflow-y-auto border-t border-dark-slate bg-dark-charcoal p-3 sm:p-4">
          <div className="mx-auto max-w-4xl space-y-2">
            {selections.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-oracle-sm bg-dark-graphite px-3 py-3 sm:px-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-txt-inverse">
                    {s.market.event.homeTeam.shortName || s.market.event.homeTeam.name} vs{' '}
                    {s.market.event.awayTeam.shortName || s.market.event.awayTeam.name}
                  </p>
                  <p className="truncate text-caption text-txt-inverse-2">
                    {s.market.name}
                  </p>
                </div>
                <ProbabilityBadge probability={s.market.probability} size="sm" />
                <button
                  onClick={() => remove(s.market.id)}
                  className="rounded p-1 text-txt-inverse-2 transition-colors hover:bg-dark-slate hover:text-danger"
                  aria-label="Remove selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-dark-slate bg-dark-ink px-3 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left text-txt-inverse"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-oracle-sm bg-oracle-gold/20">
              <Layers className="h-5 w-5 text-oracle-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-body font-semibold">
                Bet Builder
                <span className="ml-2 rounded-full bg-oracle-gold/20 px-2 py-0.5 text-caption font-bold text-oracle-gold">
                  {count}
                </span>
              </p>
              <p className="truncate text-caption text-txt-inverse-2">
                Combined: {formatProbability(combinedProbability)}
              </p>
            </div>
            <ChevronUp
              className={cn(
                'h-4 w-4 flex-shrink-0 text-txt-inverse-2 transition-transform',
                expanded && 'rotate-180',
              )}
            />
          </button>

          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              className="hidden text-txt-inverse-2 hover:bg-danger/10 hover:text-danger sm:inline-flex"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <button
              onClick={() => clear()}
              className="rounded-md p-2 text-txt-inverse-2 transition-colors hover:bg-danger/10 hover:text-danger sm:hidden"
              aria-label="Clear builder"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Button variant="gold" size="sm" onClick={handleExport}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Export'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Fallback export overlay — shown when clipboard isn't available */}
      {showExportText && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowExportText(null)}
        >
          <div
            className="w-full max-w-md rounded-oracle-lg bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 font-display text-heading font-semibold text-txt-primary">
              Your Bet Slip
            </h3>
            <textarea
              readOnly
              value={showExportText}
              className="h-56 w-full resize-none rounded-oracle-sm border border-warm-sand bg-warm-cream p-3 font-mono text-body-sm text-txt-primary focus:outline-none"
              onFocus={(e) => e.target.select()}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(showExportText);
                    setCopied(true);
                    setTimeout(() => { setCopied(false); setShowExportText(null); }, 1500);
                  } catch {
                    // textarea is already selected for manual copy
                  }
                }}
                className="flex-1 rounded-oracle-sm bg-dark-ink px-4 py-2.5 text-body-sm font-semibold text-txt-inverse transition-colors hover:bg-dark-charcoal"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={() => setShowExportText(null)}
                className="rounded-oracle-sm border border-warm-sand px-4 py-2.5 text-body-sm font-medium text-txt-secondary transition-colors hover:bg-warm-cream"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
