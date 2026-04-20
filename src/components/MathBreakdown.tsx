import { useState } from "react";
import { inr, type Balance, type Expense, type Friend } from "@/lib/settle";
import AnimatedNumber from "./AnimatedNumber";

type Props = {
  friends: Friend[];
  expenses: Expense[];
  balances: Balance[];
};

const friendEmoji = (net: number) => (net > 0.01 ? "😊" : net < -0.01 ? "😟" : "😐");

export default function MathBreakdown({ friends, expenses, balances }: Props) {
  const friendName = (id: string) => friends.find((f) => f.id === id)?.name ?? "—";
  const [openId, setOpenId] = useState<string | null>(friends[0]?.id ?? null);

  return (
    <div className="space-y-6">
      {/* Section A — Expense Breakdown Table */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          A · Expense Breakdown
        </h3>
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-sm">
            <thead className="bg-background/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Expense</th>
                <th className="px-3 py-2 font-medium font-mono-num">Total</th>
                <th className="px-3 py-2 font-medium">Paid By</th>
                <th className="px-3 py-2 font-medium">Split</th>
                <th className="px-3 py-2 font-medium font-mono-num">Per Person</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => {
                const per = e.amount / e.splitBetween.length;
                return (
                  <tr key={e.id} className="border-t border-card-border">
                    <td className="px-3 py-2 font-medium">{e.description}</td>
                    <td className="px-3 py-2 font-mono-num">{inr(e.amount)}</td>
                    <td className="px-3 py-2">{friendName(e.paidBy)}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {e.splitBetween.length} {e.splitBetween.length === 1 ? "person" : "people"}
                    </td>
                    <td className="px-3 py-2 font-mono-num text-primary-glow">
                      {inr(per)}/person
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B — Individual Ledger */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          B · Individual Ledger
        </h3>
        <div className="space-y-2">
          {balances.map((b) => {
            const open = openId === b.id;
            const paidExpenses = expenses.filter((e) => e.paidBy === b.id);
            const owedItems = expenses
              .filter((e) => e.splitBetween.includes(b.id))
              .map((e) => ({
                desc: e.description,
                amount: e.amount / e.splitBetween.length,
              }));
            const positive = b.net > 0.01;
            const negative = b.net < -0.01;
            return (
              <div
                key={b.id}
                className="rounded-xl border border-card-border bg-background/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : b.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-background/60 transition-colors text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden>{friendEmoji(b.net)}</span>
                    <span className="font-semibold">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold font-mono-num ${
                        positive ? "text-success" : negative ? "text-danger" : "text-muted-foreground"
                      }`}
                    >
                      {positive ? "+" : ""}
                      <AnimatedNumber value={b.net} prefix="₹" decimals={0} />
                      {positive ? " ✅" : negative ? " ❌" : ""}
                    </span>
                    <span className="text-muted-foreground text-sm">{open ? "−" : "+"}</span>
                  </div>
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1 text-sm space-y-2 animate-fade-in font-mono-num">
                    <div>
                      <span className="text-muted-foreground">├── Paid: </span>
                      {paidExpenses.length === 0 ? (
                        <span className="text-muted-foreground">nothing</span>
                      ) : (
                        paidExpenses.map((e, i) => (
                          <span key={e.id}>
                            {i > 0 && " + "}
                            {e.description} {inr(e.amount)}
                          </span>
                        ))
                      )}
                      <span className="text-muted-foreground">
                        {" "}= {inr(b.paid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">├── Owes: </span>
                      {owedItems.length === 0 ? (
                        <span className="text-muted-foreground">nothing</span>
                      ) : (
                        owedItems.map((it, i) => (
                          <span key={i}>
                            {i > 0 && " + "}
                            {it.desc} {inr(it.amount)}
                          </span>
                        ))
                      )}
                      <span className="text-muted-foreground">
                        {" "}= {inr(b.share)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">└── Net Balance: </span>
                      <span
                        className={`font-bold ${
                          positive ? "text-success" : negative ? "text-danger" : "text-muted-foreground"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {inr(b.net)}{" "}
                        {positive
                          ? "✅ (gets back)"
                          : negative
                            ? "❌ (owes)"
                            : "(settled)"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
