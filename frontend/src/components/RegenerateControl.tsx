interface RegenerateControlProps {
  destination: string;
  onEdit: () => void;
}

export function RegenerateControl({ destination, onEdit }: RegenerateControlProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-sm">
      <span className="text-sm font-medium text-ink">{destination}</span>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink transition-transform duration-150 ease-out hover:border-accent/50 active:scale-[0.98]"
      >
        Edit budget or preferences
      </button>
    </div>
  );
}
