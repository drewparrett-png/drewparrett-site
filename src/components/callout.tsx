interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "metric";
}

export function Callout({ children, type = "info" }: CalloutProps) {
  const borderColor =
    type === "metric" ? "border-[var(--label-work)]" : "border-[var(--muted)]";

  return (
    <div
      className={`border-l-2 ${borderColor} pl-4 py-2 my-6 text-[var(--muted)]`}
    >
      {children}
    </div>
  );
}
