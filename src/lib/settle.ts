export type Friend = { id: string; name: string };
export type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // friend id
  splitBetween: string[]; // friend ids
};

export type Balance = { id: string; name: string; paid: number; share: number; net: number };
export type Transaction = { from: string; to: string; amount: number };

export function computeBalances(friends: Friend[], expenses: Expense[]): Balance[] {
  const map = new Map<string, { paid: number; share: number }>();
  friends.forEach((f) => map.set(f.id, { paid: 0, share: 0 }));

  for (const e of expenses) {
    const payer = map.get(e.paidBy);
    if (payer) payer.paid += e.amount;
    if (e.splitBetween.length === 0) continue;
    const share = e.amount / e.splitBetween.length;
    for (const pid of e.splitBetween) {
      const p = map.get(pid);
      if (p) p.share += share;
    }
  }

  return friends.map((f) => {
    const v = map.get(f.id)!;
    return {
      id: f.id,
      name: f.name,
      paid: v.paid,
      share: v.share,
      net: v.paid - v.share,
    };
  });
}

export function settle(balances: Balance[]): Transaction[] {
  const creditors = balances
    .filter((b) => b.net > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.net - a.net);
  const debtors = balances
    .filter((b) => b.net < -0.01)
    .map((b) => ({ ...b, net: -b.net }))
    .sort((a, b) => b.net - a.net);

  const txs: Transaction[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const amt = Math.min(d.net, c.net);
    txs.push({ from: d.name, to: c.name, amount: Math.round(amt * 100) / 100 });
    d.net -= amt;
    c.net -= amt;
    if (d.net < 0.01) i++;
    if (c.net < 0.01) j++;
  }
  return txs;
}

export const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
