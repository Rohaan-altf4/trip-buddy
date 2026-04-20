import { useState } from "react";
import { inr, type Expense, type Friend } from "@/lib/settle";

type Props = {
  friends: Friend[];
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  totalSpent: number;
  uid: () => string;
};

export default function ExpensesCard({ friends, expenses, setExpenses, totalSpent, uid }: Props) {
  const [showExpForm, setShowExpForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const friendName = (id: string) => friends.find((f) => f.id === id)?.name ?? "—";

  const openExpForm = () => {
    setDesc("");
    setAmount("");
    setPaidBy(friends[0]?.id ?? "");
    setSplitBetween(friends.map((f) => f.id));
    setErrors({});
    setShowExpForm(true);
  };

  const saveExpense = () => {
    const errs: Record<string, string> = {};
    if (!desc.trim()) errs.desc = "Description is required";
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) errs.amount = "Enter an amount greater than 0";
    if (!paidBy) errs.paidBy = "Select who paid";
    if (splitBetween.length === 0) errs.split = "Select at least one person";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setExpenses([
      ...expenses,
      { id: uid(), description: desc.trim(), amount: amt, paidBy, splitBetween },
    ]);
    setShowExpForm(false);
  };

  const toggleSplit = (id: string) => {
    setSplitBetween((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  return (
    <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-card border border-card-border animate-slide-up">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">
          <span className="text-primary-glow mr-2">Step 2</span> Log Expenses
        </h2>
        <span className="text-xs text-muted-foreground font-mono-num">Total {inr(totalSpent)}</span>
      </div>

      <div className="mt-4 space-y-3">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="group rounded-xl border border-card-border bg-background/40 p-4 flex items-start justify-between gap-4 animate-pop-in lift-on-hover"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{e.description}</h3>
                <span className="text-primary-glow font-bold font-mono-num">{inr(e.amount)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Paid by <span className="font-medium text-foreground">{friendName(e.paidBy)}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Split: {e.splitBetween.map(friendName).join(", ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}
              className="text-muted-foreground hover:text-danger transition-colors text-base shrink-0 p-2 -m-2 hover:animate-shake"
              aria-label="Delete expense"
            >
              ✕
            </button>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-sm text-muted-foreground">No expenses yet.</p>
        )}
      </div>

      {!showExpForm ? (
        <button
          type="button"
          onClick={openExpForm}
          disabled={friends.length < 2}
          className="mt-4 w-full rounded-lg border-2 border-dashed border-card-border hover:border-primary hover:text-primary-glow transition-colors py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          + Add Expense
        </button>
      ) : (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-slide-up">
          <div>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description (e.g. Hotel)"
              className="w-full rounded-lg bg-input text-input-foreground border border-card-border px-4 py-3 outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
            />
            {errors.desc && <p className="mt-1 text-xs text-danger">{errors.desc}</p>}
          </div>
          <div>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="w-full rounded-lg bg-input text-input-foreground border border-card-border px-4 py-3 outline-none focus:ring-2 focus:ring-ring font-mono-num min-h-[44px]"
            />
            {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Paid by</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="mt-1 w-full rounded-lg bg-input text-input-foreground border border-card-border px-4 py-3 outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
            >
              {friends.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {errors.paidBy && <p className="mt-1 text-xs text-danger">{errors.paidBy}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Split between</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {friends.map((f) => {
                const on = splitBetween.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleSplit(f.id)}
                    className={`rounded-full px-3 py-2 text-sm font-medium transition-colors min-h-[44px] ${
                      on
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/15"
                    }`}
                  >
                    {on ? "✓ " : ""}{f.name}
                  </button>
                );
              })}
            </div>
            {errors.split && <p className="mt-1 text-xs text-danger">{errors.split}</p>}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={saveExpense}
              className="flex-1 rounded-lg bg-primary text-primary-foreground px-4 py-3 font-medium hover:bg-primary-glow transition-colors min-h-[44px]"
            >
              Save Expense
            </button>
            <button
              type="button"
              onClick={() => setShowExpForm(false)}
              className="rounded-lg bg-muted text-muted-foreground px-4 py-3 font-medium hover:bg-muted/80 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
