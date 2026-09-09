"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Award,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/projects",        label: "Projects",        icon: FolderGit2 },
  { href: "/admin/skills",          label: "Skills",          icon: Wrench },
  { href: "/admin/certifications",  label: "Certifications",  icon: Award },
  { href: "/admin/messages",        label: "Messages",        icon: MessageSquare },
];

const S = {
  sidebar: {
    width: "260px",
    background: "#161b22",
    borderRight: "1px solid #2a3340",
    display: "flex" as const,
    flexDirection: "column" as const,
    height: "100%",
  },
  logo: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "10px",
    padding: "20px 16px 18px",
    borderBottom: "1px solid #2a3340",
  },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, #1e6bff, #1252cc)",
    display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(30,107,255,0.35)",
  },
  nav: { flex: 1, padding: "12px 8px", overflowY: "auto" as const },
  footer: { padding: "8px 8px 16px", borderTop: "1px solid #2a3340" },
  footerBtn: {
    display: "flex" as const, alignItems: "center" as const, gap: "10px",
    padding: "9px 10px", borderRadius: "8px", width: "100%",
    fontSize: "13px", fontWeight: 500, cursor: "pointer" as const,
    border: "none", background: "none", textAlign: "left" as const,
    transition: "background 0.15s, color 0.15s",
  },
};

function NavItem({ href, label, Icon, active }: { href: string; label: string; Icon: React.ElementType; active: boolean }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "9px 10px", borderRadius: "8px", marginBottom: "2px",
      fontSize: "13px", fontWeight: active ? 600 : 500,
      color: active ? "#58a6ff" : "#8b949e",
      background: active ? "rgba(30,107,255,0.12)" : "transparent",
      border: active ? "1px solid rgba(30,107,255,0.2)" : "1px solid transparent",
      textDecoration: "none", transition: "all 0.15s",
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e6edf3"; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b949e"; }}}
    >
      <Icon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
      {label}
    </Link>
  );
}

function SidebarInner({ email, onClose }: { email: string; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <div style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <Shield style={{ width: "18px", height: "18px", color: "#fff" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#e6edf3" }}>Admin Panel</div>
          <div style={{ fontSize: "11px", color: "#4d5966", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#4d5966", padding: "4px" }}>
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={S.nav} aria-label="Admin navigation">
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#4d5966", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px 8px" }}>
          Navigation
        </div>
        {NAV.map(({ href, label, icon: Icon }) => (
          <NavItem key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
        ))}
      </nav>

      {/* Footer */}
      <div style={S.footer}>
        <a href="/" target="_blank" rel="noopener noreferrer"
          style={{ ...S.footerBtn, color: "#8b949e", textDecoration: "none", display: "flex" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e6edf3"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b949e"; }}
        >
          <ExternalLink style={{ width: "15px", height: "15px", flexShrink: 0 }} />
          View Portfolio
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{ ...S.footerBtn, color: "#8b949e" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b949e"; }}
        >
          <LogOut style={{ width: "15px", height: "15px", flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside style={{
        position: "fixed", left: 0, top: 0, bottom: 0,
        width: "260px", zIndex: 30, flexDirection: "column",
      }} className="hidden md:flex">
        <SidebarInner email={email} />
      </aside>

      {/* Mobile topbar — hidden on md+ via style tag below */}
      <div id="admin-mobile-topbar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        height: "56px", background: "#161b22", borderBottom: "1px solid #2a3340",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, #1e6bff, #1252cc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield style={{ width: "14px", height: "14px", color: "#fff" }} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#e6edf3" }}>Admin</span>
        </div>
        <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b949e", padding: "6px" }} aria-label="Toggle menu">
          {open ? <X style={{ width: "20px", height: "20px" }} /> : <Menu style={{ width: "20px", height: "20px" }} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 35 }} onClick={() => setOpen(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
          <aside style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "260px", zIndex: 36 }} onClick={e => e.stopPropagation()}>
            <SidebarInner email={email} onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Hide mobile topbar on desktop */}
      <style>{`
        @media (min-width: 768px) { #admin-mobile-topbar { display: none !important; } }
        @media (max-width: 767px) { #admin-mobile-topbar { display: flex !important; } }
      `}</style>
    </>
  );
}
