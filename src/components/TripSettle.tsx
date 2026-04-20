import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeBalances,
  settle,
  type Expense,
  type Friend,
} from "@/lib/settle";
import FloatingShapes from "./FloatingShapes";
import Navbar from "./Navbar";
import StepIndicator from "./StepIndicator";
import FriendsCard from "./FriendsCard";
import ExpensesCard from "./ExpensesCard";
import SettleCard from "./SettleCard";
import MobileBottomBar from "./MobileBottomBar";

let _uidCounter = 0;
const uid = () => `id-${++_uidCounter}-${Date.now().toString(36)}`;

const SEED_FRIENDS: Friend[] = [
  { id: "f1", name: "Rahul" },
  { id: "f2", name: "Priya" },
  { id: "f3", name: "Arjun" },
  { id: "f4", name: "Sneha" },
];

const SEED_EXPENSES: Expense[] = [
  {
    id: "e1",
    description: "Hotel",
    amount: 4000,
    paidBy: "f1",
    splitBetween: ["f1", "f2", "f3", "f4"],
  },
  {
    id: "e2",
    description: "Cab to Airport",
    amount: 800,
    paidBy: "f2",
    splitBetween: ["f2", "f3"],
  },
  {
    id: "e3",
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
  const [calcKey, setCalcKey] = useState(0);
  const settleRef = useRef<HTMLDivElement | null>(null);

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

  const reset = () => {
    setFriends([]);
    setExpenses([]);
    setNameInput("");
    setCalcKey(0);
  };

  const balances = useMemo(() => computeBalances(friends, expenses), [friends, expenses]);
  const transactions = useMemo(() => settle(balances), [balances]);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const canCalculate = friends.length >= 2 && expenses.length > 0;

  const activeStep: 1 | 2 | 3 =
    friends.length < 2 ? 1 : expenses.length === 0 ? 2 : 3;

  useEffect(() => {
    if (calcKey > 0 && settleRef.current) {
      settleRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [calcKey]);

  const triggerCalculate = () => {
    if (!canCalculate) return;
    setCalcKey((k) => k + 1);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <FloatingShapes />
      <Navbar onReset={reset} />

      <main className="mx-auto max-w-7xl px-4 sm:px-5 py-6 lg:py-8 pb-28 lg:pb-12 space-y-6">
        <div className="lg:hidden">
          <StepIndicator active={activeStep} />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left column: Steps 1 + 2 */}
          <div className="lg:col-span-2 space-y-6">
            <FriendsCard
              friends={friends}
              nameInput={nameInput}
              setNameInput={setNameInput}
              addFriend={addFriend}
              removeFriend={removeFriend}
            />
            <ExpensesCard
              friends={friends}
              expenses={expenses}
              setExpenses={setExpenses}
              totalSpent={totalSpent}
              uid={uid}
            />
            <button
              type="button"
              onClick={triggerCalculate}
              disabled={!canCalculate}
              className="hidden lg:block w-full rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg hover:bg-primary-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow"
            >
              ✨ Recalculate Settlement
            </button>
          </div>

          {/* Right column: Step 3 */}
          <div className="lg:col-span-3" ref={settleRef}>
            <SettleCard
              friends={friends}
              expenses={expenses}
              balances={balances}
              transactions={transactions}
              canCalculate={canCalculate}
              triggerKey={calcKey}
            />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-5 pb-24 lg:pb-8 pt-2 text-center text-xs text-muted-foreground">
        Built with Discrete Mathematics — Inclusion-Exclusion Principle
      </footer>

      <MobileBottomBar
        friendCount={friends.length}
        expenseCount={expenses.length}
        total={totalSpent}
        canCalculate={canCalculate}
        onCalculate={triggerCalculate}
      />
    </div>
  );
}
