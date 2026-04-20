import { useEffect, useState } from "react";
import type { Balance, Expense, Friend, Transaction } from "@/lib/settle";
import MathBreakdown from "./MathBreakdown";
import TransactionFlow from "./TransactionFlow";
import MathExplainer from "./MathExplainer";

type Props = {
  friends: Friend[];
  expenses: Expense[];
  balances: Balance[];
  transactions: Transaction[];
  canCalculate: boolean;
  triggerKey: number; // bumps when "Calculate" is pressed to force calc animation
};

export default function SettleCard({
  friends,
  expenses,
  balances,
  transactions,
  canCalculate,
  triggerKey,
}: Props) {
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) return;
    setCalculating(true);
    const t = setTimeout(() => setCalculating(false), 1500);
    return () => clearTimeout(t);
  }, [triggerKey]);

  return (
    <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-card border border-card-border animate-slide-up space-y-6 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">
          <span className="text-primary-glow mr-2">Step 3</span> Settle Up
        </h2>
        <span className="text-xs text-muted-foreground">Live</span>
      </div>

      {!canCalculate && (
        <div className="rounded-xl border border-dashed border-card-border p-6 text-center text-sm text-muted-foreground">
          Add at least 2 friends and 1 expense to see the settlement.
        </div>
      )}

      {canCalculate && calculating && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
          <span className="text-5xl inline-block animate-spin-slow" aria-hidden>🪙</span>
          <p className="text-muted-foreground font-medium">Calculating settlement…</p>
        </div>
      )}

      {canCalculate && !calculating && (
        <div className="space-y-6 animate-fade-in">
          <MathBreakdown friends={friends} expenses={expenses} balances={balances} />
          <TransactionFlow transactions={transactions} balances={balances} />
          <MathExplainer />
        </div>
      )}
    </section>
  );
}
