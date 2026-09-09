"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X, Sun, Moon } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { useTheme } from "@/components/ui/ThemeProvider";

const LINKS = [
  { label: "Home",           href: "#home" },
  { label: "About",          href: "#about" },
  { label: "Skills",         href: "#skills" },
  { label: "Experience",     href: "#experience" },
  { label: "Projects",       href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact",        href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState("home");
  const [mounted,  setMounted]  = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [mounted]);

  const go = (href: string) => {
    setOpen(false);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

  const navBg = scrolled
    ? "var(--nav-bg)"
    : "var(--nav-bg)";
  const navBorder = scrolled ? "1px solid var(--nav-border)" : "1px solid transparent";
  const navShadow = scrolled ? "0 2px 24px rgba(0,0,0,0.07)" : "none";

  return (
    <>
      {/* ── Navbar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: "blur(16px)",
          borderBottom: navBorder,
          boxShadow: navShadow,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            padding: "0 32px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => go("#home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginRight: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
            }}
            aria-label="Home"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              KD
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--heading)", lineHeight: 1.2 }}>
                Kaustubh Dhamale
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.2 }}>
                Azure Cloud Engineer
              </div>
            </div>
          </button>

          {/* Desktop nav — only shown on large screens via JS-controlled display */}
          <nav
            aria-label="Main navigation"
            id="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            {LINKS.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <button
                  key={href}
                  onClick={() => go(href)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--blue)" : "var(--text-2)",
                    background: isActive ? "var(--blue-soft)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Social + Resume — desktop */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginLeft: "16px",
            }}
          >
            <a
              href="https://github.com/kaustubh7-coder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <GithubIcon className="w-[18px] h-[18px]" />
            </a>
            <a
              href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
            <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                width: "36px", height: "36px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--text-2)", transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-soft)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {mounted && theme === "dark"
                ? <Sun style={{ width: "17px", height: "17px" }} />
                : <Moon style={{ width: "17px", height: "17px" }} />}
            </button>
            <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />
            <a
              href="/Kaustubh Dhamale CV.pdf"
              download
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Download style={{ width: "14px", height: "14px" }} />
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            id="mobile-menu-btn"
            style={{
              display: "none",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#475569",
              marginLeft: "8px",
            }}
          >
            {open ? <X style={{ width: "20px", height: "20px" }} /> : <Menu style={{ width: "20px", height: "20px" }} />}
          </button>
        </div>
      </header>

      {/* ── Responsive style ── */}
      <style>{`
        @media (max-width: 1023px) {
          #desktop-nav { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 1024px) {
          #mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 98,
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
                width: "280px",
                background: "var(--bg-card)",
                borderLeft: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 20px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--heading)" }}>
                  Menu
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--bg-soft)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-2)",
                  }}
                  aria-label="Close"
                >
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
              </div>

              {/* Links */}
              <nav style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {LINKS.map(({ label, href }, i) => {
                  const isActive = active === href.slice(1);
                  return (
                    <motion.button
                      key={href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => go(href)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "var(--blue)" : "var(--text-2)",
                        background: isActive ? "var(--blue-soft)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div style={{ padding: "16px 20px 28px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <a
                  href="/Kaustubh Dhamale CV.pdf"
                  download
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <Download style={{ width: "16px", height: "16px" }} />
                  Download Resume
                </a>
                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                  <a href="https://github.com/kaustubh7-coder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    style={{ color: "#64748b", textDecoration: "none" }}>
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    style={{ color: "#64748b", textDecoration: "none" }}>
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
