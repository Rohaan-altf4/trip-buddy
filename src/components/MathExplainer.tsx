export default function MathExplainer() {
  return (
    <div
      className="rounded-xl p-5 border-l-4 border-primary"
      style={{ background: "var(--color-math-bg)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden>📘</span>
        <h3 className="text-base font-semibold">The Math Behind This</h3>
      </div>
      <pre className="font-mono-num text-[13px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">{`Step 1: For each expense, divide  amount ÷ number_of_people_in_split
Step 2: Sum what each person paid           → total_paid
Step 3: Sum what each person owes overall   → total_share
Step 4: Net Balance = total_paid − total_share
        Positive = others owe you  |  Negative = you owe others
Step 5: Inclusion-Exclusion ensures no amount is double-counted
        even when the same person appears in multiple expense splits`}</pre>
    </div>
  );
}
