import { useEffect, useRef, useState } from "react";

type Props = {
  onReset: () => void;
  tripName: string;
  setTripName: (v: string) => void;
};

export default function Navbar({ onReset, tripName, setTripName }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(tripName);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(tripName);
  }, [tripName]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const v = draft.trim();
    setTripName(v || "My Trip");
    setEditing(false);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-card-border">
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden>✈️</span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight leading-tight">
              Trip<span className="text-primary-glow">Settle</span>
            </h1>
            {editing ? (
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") {
                    setDraft(tripName);
                    setEditing(false);
                  }
                }}
                placeholder="Trip name (e.g. Goa)"
                maxLength={40}
                className="mt-0.5 bg-transparent border-b border-primary/60 outline-none text-sm font-medium text-foreground w-44 sm:w-60"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary-glow transition-colors group truncate max-w-[60vw]"
                title="Click to rename trip"
              >
                <span className="truncate font-medium">{tripName || "Name your trip"}</span>
                <span className="opacity-60 group-hover:opacity-100 text-xs" aria-hidden>✎</span>
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-lg bg-muted text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors px-3 py-2 text-sm font-medium min-h-[44px]"
        >
          ↻ Reset Trip
        </button>
      </div>
    </header>
  );
}
