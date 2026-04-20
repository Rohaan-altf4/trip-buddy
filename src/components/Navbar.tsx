type Props = {
  onReset: () => void;
};

export default function Navbar({ onReset }: Props) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-card-border">
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>✈️</span>
          <h1 className="text-xl font-bold tracking-tight">
            Trip<span className="text-primary-glow">Settle</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-muted text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors px-3 py-2 text-sm font-medium min-h-[44px]"
        >
          ↻ Reset Trip
        </button>
      </div>
    </header>
  );
}
