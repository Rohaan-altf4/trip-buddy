import { useCountUp } from "@/hooks/use-count-up";

type Props = {
  value: number;
  prefix?: string;
  className?: string;
  decimals?: number;
};

export default function AnimatedNumber({ value, prefix = "", className, decimals = 0 }: Props) {
  const v = useCountUp(value, 700);
  const formatted = v.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span className={className}>
      {prefix}
      {formatted}
    </span>
  );
}
