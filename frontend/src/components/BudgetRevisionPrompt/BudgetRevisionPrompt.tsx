import { useState } from 'react';
import type { BudgetTooHigh, BudgetTooLow, TripInput } from '../../api/types';
import { formatInr } from '../../lib/currency';

interface BudgetRevisionPromptProps {
  result: BudgetTooLow | BudgetTooHigh;
  lastInput: TripInput;
  onResubmit: (input: TripInput) => void;
}

function nextHotelTier(current?: string): string {
  if (current === 'Budget') return 'Standard';
  return 'Luxury';
}

export function BudgetRevisionPrompt({ result, lastInput, onResubmit }: BudgetRevisionPromptProps) {
  const isTooLow = result.status === 'budget_too_low';
  const [revising, setRevising] = useState(isTooLow);
  const [revisedBudget, setRevisedBudget] = useState(
    isTooLow && result.minimumViableBudgetInr ? String(result.minimumViableBudgetInr) : String(lastInput.budgetInr)
  );

  function submitRevisedBudget() {
    const value = Number(revisedBudget);
    if (!value || value <= 0) return;
    onResubmit({ ...lastInput, budgetInr: value });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div
        className={`rounded-xl border p-4 ${
          isTooLow ? 'border-danger/30 bg-danger-soft' : 'border-warning/30 bg-warning-soft'
        }`}
      >
        <h1 className="text-lg font-semibold text-ink">
          {isTooLow ? 'This budget is too tight' : 'This budget has room to spare'}
        </h1>
        <p className="mt-1 text-ink-muted">{result.message}</p>
      </div>

      {!isTooLow && !revising && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setRevising(true)}
            className="flex-1 rounded-lg border border-border bg-surface-raised px-4 py-2.5 font-medium text-ink transition-transform duration-150 ease-out hover:border-accent/50 active:scale-[0.98]"
          >
            Lower the budget
          </button>
          <button
            type="button"
            onClick={() => onResubmit({ ...lastInput, hotelType: nextHotelTier(lastInput.hotelType) })}
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition-transform duration-150 ease-out hover:bg-accent-strong active:scale-[0.98]"
          >
            Upgrade the experience
          </button>
        </div>
      )}

      {revising && (
        <div className="flex flex-col gap-3">
          <label htmlFor="revisedBudget" className="text-sm font-medium text-ink">
            New budget (₹)
          </label>
          <input
            id="revisedBudget"
            type="number"
            min={1}
            inputMode="numeric"
            value={revisedBudget}
            onChange={(e) => setRevisedBudget(e.target.value)}
            className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
          <button
            type="button"
            onClick={submitRevisedBudget}
            className="self-start rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition-transform duration-150 ease-out hover:bg-accent-strong active:scale-[0.98]"
          >
            Try this budget
          </button>
        </div>
      )}
    </div>
  );
}
