export default function FloatingShapes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute top-[10%] left-[8%] h-72 w-72 rounded-full opacity-[0.18] blur-2xl animate-drift-1"
        style={{ background: "var(--color-shape)" }}
      />
      <div
        className="absolute top-[55%] right-[6%] h-96 w-96 opacity-[0.15] blur-2xl animate-drift-2"
        style={{
          background: "var(--color-shape)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
      <div
        className="absolute bottom-[8%] left-[20%] h-64 w-64 opacity-[0.16] blur-2xl animate-drift-3"
        style={{ background: "var(--color-shape)", borderRadius: "30%" }}
      />
      <div
        className="absolute top-[30%] right-[28%] h-48 w-48 rounded-full opacity-[0.12] blur-2xl animate-drift-1"
        style={{ background: "var(--color-shape)", animationDelay: "-8s" }}
      />
      <div
        className="absolute top-[5%] right-[40%] h-40 w-40 opacity-[0.14] blur-xl animate-drift-2"
        style={{
          background: "var(--color-shape)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
