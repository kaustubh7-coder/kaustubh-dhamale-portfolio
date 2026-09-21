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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
    setTimeout(() => {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.07)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: "1140px", margin: "0 auto",
          padding: "0 20px",
          height: "64px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          {/* Logo */}
          <button onClick={() => go("#home")} aria-label="Home"
            style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "auto", background: "none", border: "none", cursor: "pointer", padding: "4px 0", minHeight: "44px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
              background: "linear-gradient(135deg, #1e6bff, #1252cc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "13px", fontWeight: 700,
            }}>KD</div>
            <div style={{ textAlign: "left" }} id="nav-logo-text">
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--heading)", lineHeight: 1.2 }}>Kaustubh Dhamale</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.2 }}>Azure Cloud Engineer</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" id="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {LINKS.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <button key={href} onClick={() => go(href)} style={{
                  padding: "8px 12px", borderRadius: "8px", fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--blue)" : "var(--text-2)",
                  background: isActive ? "var(--blue-soft)" : "transparent",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 0.15s ease", minHeight: "44px",
                }}>{label}</button>
              );
            })}
          </nav>

          {/* Desktop right icons */}
          <div id="desktop-actions" style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "8px" }}>
            <a href="https://github.com/kaustubh7-coder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-soft)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <GithubIcon className="w-[18px] h-[18px]" />
            </a>
            <a href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-soft)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
            <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 2px" }} />
            <button onClick={toggle} aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-2)", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-soft)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {mounted && theme === "dark" ? <Sun style={{ width: "17px", height: "17px" }} /> : <Moon style={{ width: "17px", height: "17px" }} />}
            </button>
            <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 2px" }} />
            <a href="/Kaustubh Dhamale CV.pdf" download
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "linear-gradient(135deg, #1e6bff, #1252cc)", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", minHeight: "44px" }}>
              <Download style={{ width: "14px", height: "14px" }} />
              Resume
            </a>
          </div>

          {/* Mobile right — theme toggle + hamburger */}
          <div id="mobile-actions" style={{ display: "none", alignItems: "center", gap: "4px" }}>
            <button onClick={toggle} aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              style={{ width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-2)" }}>
              {mounted && theme === "dark" ? <Sun style={{ width: "18px", height: "18px" }} /> : <Moon style={{ width: "18px", height: "18px" }} />}
            </button>
            <button onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
              style={{ width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--heading)" }}>
              {open ? <X style={{ width: "22px", height: "22px" }} /> : <Menu style={{ width: "22px", height: "22px" }} />}
            </button>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 1023px) {
          #desktop-nav { display: none !important; }
          #desktop-actions { display: none !important; }
          #mobile-actions { display: flex !important; }
          #nav-logo-text div:last-child { display: none; }
        }
        @media (min-width: 1024px) {
          #mobile-actions { display: none !important; }
        }
      `}</style>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 98, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            />
            <motion.div key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 99,
                width: "min(300px, 85vw)",
                background: "var(--bg-card)",
                borderLeft: "1px solid var(--border)",
                display: "flex", flexDirection: "column",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}>
              {/* Drawer header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", paddingTop: "calc(16px + env(safe-area-inset-top, 0px))" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #1e6bff, #1252cc)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700 }}>KD</div>
                  <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--heading)" }}>Menu</span>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close menu"
                  style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--bg-soft)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)" }}>
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
                {LINKS.map(({ label, href }, i) => {
                  const isActive = active === href.slice(1);
                  return (
                    <motion.button key={href}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => go(href)}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "14px 16px", borderRadius: "12px",
                        fontSize: "16px", fontWeight: isActive ? 600 : 500,
                        color: isActive ? "var(--blue)" : "var(--text-2)",
                        background: isActive ? "var(--blue-soft)" : "transparent",
                        border: "none", cursor: "pointer",
                        minHeight: "48px",
                        transition: "background 0.15s",
                      }}>
                      {label}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href="/Kaustubh Dhamale CV.pdf" download
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #1e6bff, #1252cc)", color: "#fff", fontSize: "15px", fontWeight: 600, textDecoration: "none", minHeight: "48px" }}>
                  <Download style={{ width: "16px", height: "16px" }} /> Download Resume
                </a>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                  <a href="https://github.com/kaustubh7-coder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", background: "var(--bg-soft)", border: "1px solid var(--border)", textDecoration: "none" }}>
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    style={{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", background: "var(--bg-soft)", border: "1px solid var(--border)", textDecoration: "none" }}>
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
