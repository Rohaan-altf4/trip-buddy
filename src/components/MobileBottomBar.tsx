import { inr } from "@/lib/settle";

type Props = {
  friendCount: number;
  expenseCount: number;
  total: number;
  canCalculate: boolean;
  onCalculate: () => void;
};

export default function MobileBottomBar({
  friendCount,
  expenseCount,
  total,
  canCalculate,
  onCalculate,
}: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 backdrop-blur-md bg-background/85 border-t border-card-border px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
        <div className="text-xs leading-tight">
          <p className="text-muted-foreground">
            <span className="font-mono-num text-foreground">{friendCount}</span> friends ·{" "}
            <span className="font-mono-num text-foreground">{expenseCount}</span> expenses
          </p>
          <p className="font-mono-num font-semibold text-primary-glow">{inr(total)}</p>
        </div>
        <button
          type="button"
          onClick={onCalculate}
          disabled={!canCalculate}
          className="rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:bg-primary-glow disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] shadow-glow"
        >
          Settle Up →
        </button>
      </div>
    </div>
  );
}
