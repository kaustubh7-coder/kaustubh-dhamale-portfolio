"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Download, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

export function Hero() {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" style={{
      minHeight: "100svh",
      display: "flex", alignItems: "center",
      background: "var(--section-bg)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot pattern */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
        backgroundSize: "36px 36px", opacity: 0.35, pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1140px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1, padding: "88px 20px 48px" }}>

        {/* Main grid */}
        <div id="hero-grid" style={{ display: "grid", alignItems: "center", gap: "40px" }}>

          {/* LEFT: Text */}
          <div style={{ display: "flex", flexDirection: "column" }}>

            {/* Status badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "9999px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", fontSize: "13px", fontWeight: 600, marginBottom: "24px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite", flexShrink: 0 }} />
              Available for opportunities
            </motion.div>

            {/* Name */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} style={{ marginBottom: "14px" }}>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#1e6bff", marginBottom: "6px" }}>Hi, I&apos;m</p>
              <h1 style={{ fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--heading)", marginBottom: "10px", fontSize: "clamp(2.2rem, 8vw, 4.5rem)" }}>
                Kaustubh Dhamale
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ width: "32px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)", flexShrink: 0 }} />
                <p style={{ fontSize: "clamp(15px, 4vw, 19px)", fontWeight: 600, color: "#1e6bff" }}>
                  Azure Cloud Support Engineer
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16 }}
              style={{ fontSize: "clamp(15px, 3.5vw, 17px)", lineHeight: 1.75, color: "var(--body)", maxWidth: "520px", marginBottom: "20px" }}>
              2+ years building and maintaining reliable Azure cloud infrastructure.
              Specialised in monitoring, incident management, Terraform and Linux operations.
            </motion.p>

            {/* Location */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.22 }}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "14px", marginBottom: "28px", flexWrap: "wrap" }}>
              <MapPin style={{ width: "15px", height: "15px", color: "#1e6bff", flexShrink: 0 }} />
              Pune, Maharashtra, India &nbsp;·&nbsp; +91-9370614621
            </motion.div>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
              <button onClick={() => go("projects")} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "13px 22px", borderRadius: "12px",
                background: "linear-gradient(135deg, #1e6bff, #1252cc)", color: "#fff",
                fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer",
                boxShadow: "0 4px 18px rgba(30,107,255,0.3)", minHeight: "48px",
              }}>
                View My Work <ArrowDown style={{ width: "16px", height: "16px" }} />
              </button>
              <button onClick={() => go("contact")} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "13px 22px", borderRadius: "12px",
                background: "var(--card-bg)", border: "1.5px solid var(--card-border)",
                color: "var(--heading)", fontSize: "15px", fontWeight: 600,
                cursor: "pointer", minHeight: "48px",
              }}>
                <Mail style={{ width: "16px", height: "16px", color: "#1e6bff" }} /> Contact Me
              </button>
              <a href="/Kaustubh Dhamale CV.pdf" download style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "13px 22px", borderRadius: "12px",
                background: "var(--card-bg)", border: "1.5px solid var(--card-border)",
                color: "var(--body)", fontSize: "15px", fontWeight: 600,
                textDecoration: "none", minHeight: "48px",
              }}>
                <Download style={{ width: "16px", height: "16px" }} /> Resume
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.36 }}
              style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a href="https://github.com/kaustubh7-coder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", fontWeight: 500, color: "var(--body)", textDecoration: "none", minHeight: "44px" }}>
                <GithubIcon className="w-5 h-5" /> GitHub
              </a>
              <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
              <a href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", fontWeight: 500, color: "var(--body)", textDecoration: "none", minHeight: "44px" }}>
                <LinkedinIcon className="w-5 h-5" /> LinkedIn
              </a>
            </motion.div>
          </div>

          {/* RIGHT: Photo */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Glow */}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(30,107,255,0.15) 0%, transparent 70%)", transform: "scale(1.4)", filter: "blur(24px)", borderRadius: "50%" }} />
              {/* Spinning ring */}
              <motion.div aria-hidden
                style={{ position: "absolute", inset: "-16px", borderRadius: "50%", border: "1px dashed rgba(30,107,255,0.2)", pointerEvents: "none" }}
                animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
              {/* Photo */}
              <div id="hero-photo" style={{ position: "relative", borderRadius: "50%", overflow: "hidden", border: "4px solid var(--card-bg)", boxShadow: "0 0 0 8px rgba(30,107,255,0.07), 0 24px 64px rgba(0,0,0,0.14)" }}>
                <Image src="/24031.png" alt="Kaustubh Dhamale — Azure Cloud Support Engineer"
                  fill sizes="(max-width: 480px) 200px, (max-width: 768px) 240px, 320px"
                  className="object-cover object-top" priority />
              </div>

              {/* Badge — Experience */}
              <motion.div id="badge-exp"
                style={{ position: "absolute", bottom: "-8px", left: "-16px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "14px", background: "var(--card-bg)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid var(--card-border)" }}
                animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #1e6bff, #1252cc)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 800 }}>2+</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--heading)" }}>Years</div>
                  <div style={{ fontSize: "10px", color: "var(--muted)" }}>Experience</div>
                </div>
              </motion.div>

              {/* Badge — Certified */}
              <motion.div id="badge-cert"
                style={{ position: "absolute", top: "-8px", right: "-16px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "14px", background: "var(--card-bg)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid var(--card-border)" }}
                animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #0ea5e9, #0369a1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: 800 }}>AZ</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--heading)" }}>AZ-400</div>
                  <div style={{ fontSize: "10px", color: "var(--muted)" }}>Certified</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
          id="stats-bar"
          style={{ marginTop: "56px", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden", background: "var(--card-bg)" }}>
          {[
            { n: "2+",   l: "Years Experience" },
            { n: "30+",  l: "Azure Resources" },
            { n: "100+", l: "Tickets Managed" },
            { n: "80%+", l: "Incidents Resolved" },
          ].map(({ n, l }, i) => (
            <div key={n} className="stat-item" style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "22px 12px", textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--card-border)" : "none",
            }}>
              <span style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#1e6bff", lineHeight: 1, marginBottom: "4px" }}>{n}</span>
              <span style={{ fontSize: "clamp(10px,2.5vw,12px)", fontWeight: 500, color: "var(--muted)" }}>{l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        #hero-grid { grid-template-columns: 1fr 1fr; }
        #hero-photo { width: 300px; height: 300px; }
        #stats-bar { display: grid; grid-template-columns: repeat(4,1fr); }

        @media (max-width: 900px) {
          #hero-grid { grid-template-columns: 1fr; }
          #hero-grid > div:last-child { order: -1; }
        }
        @media (max-width: 600px) {
          #hero-photo { width: 220px !important; height: 220px !important; }
          #badge-exp { display: none; }
          #badge-cert { display: none; }
          #stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .stat-item { border-left: none !important; border-top: 1px solid var(--card-border); }
          .stat-item:nth-child(2) { border-left: 1px solid var(--card-border) !important; }
          .stat-item:nth-child(3) { border-left: none !important; }
          .stat-item:nth-child(4) { border-left: 1px solid var(--card-border) !important; }
          .stat-item:first-child { border-top: none; }
          .stat-item:nth-child(2) { border-top: none; }
        }
        @media (max-width: 380px) {
          #hero-photo { width: 190px !important; height: 190px !important; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </section>
  );
}
