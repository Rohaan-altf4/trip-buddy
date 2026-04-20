

## Add sample data to TripSettle

Pre-load the app with 4 friends and 6 sample expenses so you can immediately see the settlement results without having to type everything in.

### What you'll see

**Trip name:** Goa Trip

**4 Friends:**
- Rahul
- Priya
- Arjun
- Sneha

**6 Expenses:**
| # | Description | Amount | Paid By | Split Between |
|---|-------------|--------|---------|---------------|
| 1 | Hotel Stay | ₹8,000 | Rahul | All 4 |
| 2 | Cab to Airport | ₹1,200 | Priya | Priya, Arjun |
| 3 | Dinner at Beach Shack | ₹2,400 | Sneha | All 4 |
| 4 | Water Sports | ₹3,600 | Arjun | Rahul, Arjun, Sneha |
| 5 | Breakfast | ₹900 | Priya | All 4 |
| 6 | Souvenirs | ₹1,500 | Rahul | Rahul, Priya, Sneha |

### Technical changes

Single file edit: `src/components/TripSettle.tsx`
- Replace the empty `useState<Friend[]>([])` and `useState<Expense[]>([])` initializers with seeded arrays containing the 4 friends and 6 expenses above (using fixed string IDs like `"f1"`, `"e1"` so the references between `paidBy`/`splitBetween` and friend IDs stay valid).
- Change default `tripName` from `"My Trip"` to `"Goa Trip"`.
- Keep the `reset` function as-is so clicking "Reset Trip" still wipes everything to a clean slate (empty friends, empty expenses, name back to "My Trip").

No other files need to change. Step 3 (Settle Up) will populate live as soon as the app loads, showing the full math breakdown, individual ledgers, and minimum transactions.

