interface DestinationSuggesterProps {
  recommended: string;
  alternatives: string[];
  onConfirm: () => void;
  onChooseDifferent: (destination: string) => void;
}

export function DestinationSuggester({
  recommended,
  alternatives,
  onConfirm,
  onChooseDifferent,
}: DestinationSuggesterProps) {
  const others = alternatives.filter((d) => d !== recommended);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">We picked a destination for you</h1>
        <p className="mt-1 text-ink-muted">Based on your budget, days, and preferences. Pick a different one if you'd rather go elsewhere.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onConfirm}
          className="flex flex-col items-start gap-1 rounded-xl border-2 border-accent bg-accent-soft p-4 text-left transition-transform duration-150 ease-out active:scale-[0.98]"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-accent-strong">Recommended</span>
          <span className="text-lg font-semibold text-ink">{recommended}</span>
        </button>

        {others.map((destination) => (
          <button
            key={destination}
            type="button"
            onClick={() => onChooseDifferent(destination)}
            className="flex flex-col items-start gap-1 rounded-xl border border-border bg-surface-raised p-4 text-left transition-transform duration-150 ease-out hover:border-accent/50 active:scale-[0.98]"
          >
            <span className="text-xs font-medium text-ink-muted">Alternative</span>
            <span className="text-lg font-semibold text-ink">{destination}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="self-start rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition-[transform,background-color] duration-150 ease-out hover:bg-accent-strong active:scale-[0.98]"
      >
        Continue with {recommended}
      </button>
    </div>
  );
}
