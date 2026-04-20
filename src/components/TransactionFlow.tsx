import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { inr, type Balance, type Transaction } from "@/lib/settle";

type Props = {
  transactions: Transaction[];
  balances: Balance[];
};

const moodFor = (name: string, balances: Balance[]) => {
  const b = balances.find((x) => x.name === name);
  if (!b) return "😐";
  return b.net > 0.01 ? "😊" : b.net < -0.01 ? "😟" : "😐";
};

const netFor = (name: string, balances: Balance[]) => {
  const b = balances.find((x) => x.name === name);
  return b ? b.net : 0;
};

export default function TransactionFlow({ transactions, balances }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (transactions.length === 0 && !fired.current && balances.length > 0) {
      fired.current = true;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366F1", "#22C55E", "#818CF8", "#F8FAFC"],
      });
    }
    if (transactions.length > 0) fired.current = false;
  }, [transactions.length, balances.length]);

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
        C · Minimum Transactions ({transactions.length})
      </h3>
      <div className="rounded-xl bg-primary/10 border border-primary/30 p-3 mb-3 text-sm">
        💡 We sort everyone by balance — biggest debtors pay the biggest creditors first. This
        gives the minimum number of transfers.
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-success font-medium">
          🎉 All settled up — no payments needed!
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t, i) => {
            const fromNet = netFor(t.from, balances);
            const toNet = netFor(t.to, balances);
            return (
              <div
                key={i}
                className="rounded-xl bg-background/50 border border-card-border p-4 animate-flip-in"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden>{moodFor(t.from, balances)}</span>
                    <div>
                      <p className="font-semibold leading-tight">{t.from}</p>
                      <p className="text-xs text-danger font-mono-num">{inr(fromNet)}</p>
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 120 24"
                    className="flex-1 min-w-[100px] h-6"
                    preserveAspectRatio="none"
                  >
                    <line x1="2" y1="12" x2="100" y2="12" className="flow-arrow animate-dash" />
                    <polygon points="100,6 118,12 100,18" fill="oklch(0.75 0.13 280)" />
                    <text
                      x="51"
                      y="9"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                      fill="oklch(0.97 0.01 250)"
                    >
                      {inr(t.amount)}
                    </text>
                  </svg>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-semibold leading-tight">{t.to}</p>
                      <p className="text-xs text-success font-mono-num">+{inr(toNet)}</p>
                    </div>
                    <span className="text-lg" aria-hidden>{moodFor(t.to, balances)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
