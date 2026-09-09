import { cn } from "@/lib/utils";
import { AnimatedSection } from "./AnimatedSection";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <AnimatedSection delay={0}>
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[var(--accent-light)] mb-3">
          <span className="w-6 h-px bg-[var(--accent)]" />
          {label}
          <span className="w-6 h-px bg-[var(--accent)]" />
        </span>
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
          {title}
        </h2>
      </AnimatedSection>
      {subtitle && (
        <AnimatedSection delay={0.15}>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            {subtitle}
          </p>
        </AnimatedSection>
      )}
    </div>
  );
}
