type Props = {
  active: 1 | 2 | 3;
};

const steps = [
  { n: 1 as const, label: "Friends" },
  { n: 2 as const, label: "Expenses" },
  { n: 3 as const, label: "Settle" },
];

export default function StepIndicator({ active }: Props) {
  return (
    <nav className="lg:hidden flex items-center justify-center gap-2" aria-label="Steps">
      {steps.map((s, i) => {
        const isActive = s.n === active;
        const isDone = s.n < active;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDone
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="font-mono-num">{s.n}</span>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-muted-foreground text-xs">→</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
