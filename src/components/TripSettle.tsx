import { useMemo, useState } from "react";
import {
  computeBalances,
  inr,
  settle,
  type Expense,
  type Friend,
} from "@/lib/settle";

const uid = () => Math.random().toString(36).slice(2, 10);

const SEED_FRIENDS: Friend[] = [
  { id: "f1", name: "Rahul" },
  { id: "f2", name: "Priya" },
  { id: "f3", name: "Arjun" },
  { id: "f4", name: "Sneha" },
];

const SEED_EXPENSES: Expense[] = [
  {
    id: uid(),
    description: "Hotel",
    amount: 4000,
    paidBy: "f1",
    splitBetween: ["f1", "f2", "f3", "f4"],
  },
  {
    id: uid(),
    description: "Cab to Airport",
    amount: 800,
    paidBy: "f2",
    splitBetween: ["f2", "f3"],
  },
  {
    id: uid(),
    description: "Dinner",
    amount: 1500,
    paidBy: "f4",
    splitBetween: ["f1", "f2", "f3", "f4"],
  },
];

export default function TripSettle() {
  const [friends, setFriends] = useState<Friend[]>(SEED_FRIENDS);
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [nameInput, setNameInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showMath, setShowMath] = useState(false);

  // Expense form
  const [showExpForm, setShowExpForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addFriend = () => {
    const name = nameInput.trim();
    if (!name) return;
    if (friends.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      setNameInput("");
      return;
    }
    setFriends([...friends, { id: uid(), name }]);
    setNameInput("");
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter((f) => f.id !== id));
    setExpenses(
      expenses
        .filter((e) => e.paidBy !== id)
        .map((e) => ({ ...e, splitBetween: e.splitBetween.filter((s) => s !== id) })),
    );
  };

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

  const friendName = (id: string) => friends.find((f) => f.id === id)?.name ?? "—";

  const balances = useMemo(() => computeBalances(friends, expenses), [friends, expenses]);
  const transactions = useMemo(() => settle(balances), [balances]);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const canCalculate = friends.length >= 2 && expenses.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-3xl px-5 py-8 animate-[fade-in_0.5s_ease-out]">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>✈️</span>
            <h1 className="text-3xl font-bold tracking-tight">
              Trip<span className="text-primary-glow">Settle</span>
            </h1>
          </div>
          <p className="mt-2 text-sm text-white/60">Split fairly. Settle simply.</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8 space-y-6">
        {/* Step 1 — Friends */}
        <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-card animate-[slide-up_0.4s_ease-out]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">
              <span className="text-primary mr-2">Step 1</span> Add Friends
            </h2>
            <span className="text-xs text-muted-foreground">{friends.length} added</span>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFriend()}
              placeholder="Friend's name"
              className="flex-1 rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={addFriend}
              className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 font-medium hover:bg-primary-glow transition-colors"
            >
              Add
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {friends.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium animate-[scale-in_0.2s_ease-out]"
              >
                {f.name}
                <button
                  type="button"
                  onClick={() => removeFriend(f.id)}
                  className="hover:text-danger transition-colors"
                  aria-label={`Remove ${f.name}`}
                >
                  ✕
                </button>
              </span>
            ))}
            {friends.length === 0 && (
              <p className="text-sm text-muted-foreground">No friends yet — add at least 2 to start.</p>
            )}
          </div>
          {friends.length < 2 && friends.length > 0 && (
            <p className="mt-3 text-xs text-danger">Add at least 2 friends to continue.</p>
          )}
        </section>

        {/* Step 2 — Expenses */}
        <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-card animate-[slide-up_0.5s_ease-out]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">
              <span className="text-primary mr-2">Step 2</span> Log Expenses
            </h2>
            <span className="text-xs text-muted-foreground">Total {inr(totalSpent)}</span>
          </div>

          <div className="mt-4 space-y-3">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-border p-4 flex items-start justify-between gap-4 animate-[scale-in_0.2s_ease-out]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{e.description}</h3>
                    <span className="text-primary font-bold">{inr(e.amount)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Paid by <span className="font-medium text-card-foreground">{friendName(e.paidBy)}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Split: {e.splitBetween.map(friendName).join(", ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}
                  className="text-muted-foreground hover:text-danger transition-colors text-sm shrink-0"
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
              className="mt-4 w-full rounded-lg border-2 border-dashed border-border hover:border-primary hover:text-primary transition-colors py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Expense
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-[slide-up_0.3s_ease-out]">
              <div>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Description (e.g. Hotel)"
                  className="w-full rounded-lg bg-input px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.desc && <p className="mt-1 text-xs text-danger">{errors.desc}</p>}
              </div>
              <div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (₹)"
                  className="w-full rounded-lg bg-input px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Paid by</label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-input px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
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
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          on
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-primary/10"
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
                  className="flex-1 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium hover:bg-primary-glow transition-colors"
                >
                  Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpForm(false)}
                  className="rounded-lg bg-muted text-muted-foreground px-4 py-2.5 font-medium hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Step 3 — Calculate */}
        <section className="animate-[slide-up_0.6s_ease-out]">
          <button
            type="button"
            onClick={() => setShowResults(true)}
            disabled={!canCalculate}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg hover:bg-primary-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow"
          >
            Calculate Settlement →
          </button>
        </section>

        {/* Results */}
        {showResults && canCalculate && (
          <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-card animate-[slide-up_0.4s_ease-out] space-y-5">
            <h2 className="text-lg font-semibold">
              <span className="text-primary mr-2">Step 3</span> Settle Up
            </h2>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Net balances</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {balances.map((b) => {
                  const positive = b.net > 0.01;
                  const negative = b.net < -0.01;
                  return (
                    <div
                      key={b.id}
                      className="rounded-xl border border-border p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{b.name}</p>
                        <p className="text-xs text-muted-foreground">
                          paid {inr(b.paid)} · share {inr(b.share)}
                        </p>
                      </div>
                      <span
                        className={`font-bold ${
                          positive ? "text-success" : negative ? "text-danger" : "text-muted-foreground"
                        }`}
                      >
                        {positive ? "+" : ""}{inr(b.net)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Minimum transactions ({transactions.length})
              </h3>
              {transactions.length === 0 ? (
                <p className="text-sm text-success">All settled up — no payments needed! 🎉</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center justify-between animate-[scale-in_0.3s_ease-out]"
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{t.from}</span>
                        <span className="text-primary">→</span>
                        <span className="font-semibold">{t.to}</span>
                      </div>
                      <span className="font-bold text-primary">{inr(t.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowMath(!showMath)}
                className="w-full text-left text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors flex justify-between items-center"
              >
                <span>📐 The Math Behind This</span>
                <span>{showMath ? "−" : "+"}</span>
              </button>
              {showMath && (
                <div className="mt-3 text-sm text-muted-foreground space-y-2 animate-[fade-in_0.3s_ease-out]">
                  <p>
                    Each expense is divided equally among its <em>split set</em> S. Person p's share
                    is <code className="bg-muted px-1.5 py-0.5 rounded">amount / |S|</code>.
                  </p>
                  <p>
                    By the <strong>Inclusion-Exclusion Principle</strong>, when computing what each
                    person owes across overlapping expense groups, we sum contributions from every
                    group they belong to without double-counting amounts they didn't share in.
                  </p>
                  <p>
                    <strong>Net balance</strong> = (total paid) − (total share). Positive means
                    they're owed money; negative means they owe.
                  </p>
                  <p>
                    The settlement uses a <strong>greedy algorithm</strong>: repeatedly match the
                    biggest debtor with the biggest creditor, producing the minimum number of
                    transactions.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="mx-auto max-w-3xl px-5 py-8 text-center text-xs text-white/40">
        Built with Discrete Mathematics — Inclusion-Exclusion Principle
      </footer>
    </div>
  );
}
