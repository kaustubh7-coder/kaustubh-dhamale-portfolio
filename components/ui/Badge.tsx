import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "cyan" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    accent:
      "bg-[var(--accent)]/10 text-[var(--accent-light)] border border-[var(--accent)]/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    outline:
      "bg-transparent text-[var(--text-secondary)] border border-[var(--border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
