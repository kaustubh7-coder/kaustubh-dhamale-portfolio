import Link from "next/link";
import { Cloud } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6">
        <Cloud className="w-8 h-8 text-[var(--accent)]" />
      </div>
      <h1 className="text-6xl font-black text-[var(--text-primary)] mb-3">404</h1>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
        This page doesn&apos;t exist. The cloud resources you&apos;re looking for may have been
        deleted or moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] transition-all"
      >
        Back to Portfolio
      </Link>
    </div>
  );
}
