import { createFileRoute } from "@tanstack/react-router";
import TripSettle from "@/components/TripSettle";

export const Route = createFileRoute("/")({
  component: TripSettle,
  head: () => ({
    meta: [
      { title: "TripSettle — Split trip expenses fairly" },
      {
        name: "description",
        content:
          "Settle group trip expenses fairly with the Inclusion-Exclusion Principle. Add friends, log expenses, and get the minimum payments to balance everyone.",
      },
      { property: "og:title", content: "TripSettle — Split trip expenses fairly" },
      {
        property: "og:description",
        content: "Add friends, log expenses, and instantly settle up in the fewest payments.",
      },
    ],
  }),
});
