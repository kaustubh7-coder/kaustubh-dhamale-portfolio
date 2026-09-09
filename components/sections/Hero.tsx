"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Download, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

export function Hero() {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(150deg, #f0f6ff 0%, #ffffff 55%, #f8f9fc 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "112px 32px 64px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Main grid ── */}
        <div id="hero-grid" style={{ display: "grid", alignItems: "center", gap: "64px" }}>

          {/* ── LEFT: Text ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#059669",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "32px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                  animation: "pulse 2s infinite",
                }}
              />
              Available for opportunities
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{ marginBottom: "16px" }}
            >
              <p style={{ fontSize: "17px", fontWeight: 600, color: "#1e6bff", marginBottom: "8px" }}>
                Hi, I&apos;m
              </p>
              <h1
                style={{
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: "#0f172a",
                  marginBottom: "12px",
                  fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
                }}
              >
                Kaustubh Dhamale
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "3px",
                    borderRadius: "9999px",
                    background: "linear-gradient(90deg, #1e6bff, #60a5fa)",
                  }}
                />
                <p style={{ fontSize: "19px", fontWeight: 600, color: "#1e6bff" }}>
                  Azure Cloud Support Engineer
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "#475569",
                maxWidth: "500px",
                marginBottom: "24px",
              }}
            >
              2+ years building and maintaining reliable Azure cloud infrastructure.
              Specialised in monitoring, incident management, Terraform and Linux operations.
            </motion.p>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "36px",
              }}
            >
              <MapPin style={{ width: "15px", height: "15px", color: "#1e6bff" }} />
              Pune, Maharashtra, India &nbsp;·&nbsp; +91-9370614621
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "36px" }}
            >
              <button
                onClick={() => go("projects")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 26px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(30,107,255,0.3)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(30,107,255,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(30,107,255,0.3)"; }}
              >
                View My Work
                <ArrowDown style={{ width: "16px", height: "16px" }} />
              </button>

              <button
                onClick={() => go("contact")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 26px",
                  borderRadius: "12px",
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  color: "#0f172a",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Mail style={{ width: "16px", height: "16px", color: "#1e6bff" }} />
                Contact Me
              </button>

              <a
                href="/resume.pdf"
                download
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 26px",
                  borderRadius: "12px",
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Download style={{ width: "16px", height: "16px" }} />
                Resume
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.36 }}
              style={{ display: "flex", alignItems: "center", gap: "20px" }}
            >
              <a
                href="https://github.com/kaustubh7-coder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#64748b",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
              >
                <GithubIcon className="w-5 h-5" />
                GitHub
              </a>
              <div style={{ width: "1px", height: "16px", background: "#e2e8f0" }} />
              <a
                href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#64748b",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0a66c2")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
              >
                <LinkedinIcon className="w-5 h-5" />
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>

              {/* Glow */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle, rgba(30,107,255,0.15) 0%, transparent 70%)",
                  transform: "scale(1.4)",
                  filter: "blur(24px)",
                  borderRadius: "50%",
                }}
              />

              {/* Spinning ring */}
              <motion.div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-24px",
                  borderRadius: "50%",
                  border: "1px dashed rgba(30,107,255,0.2)",
                  pointerEvents: "none",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Photo */}
              <div
                style={{
                  position: "relative",
                  width: "340px",
                  height: "340px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid #ffffff",
                  boxShadow: "0 0 0 8px rgba(30,107,255,0.07), 0 24px 64px rgba(0,0,0,0.14)",
                }}
              >
                <Image
                  src="/profile.jpg"
                  alt="Kaustubh Dhamale — Azure Cloud Support Engineer"
                  fill
                  sizes="340px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating badge — Experience */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "-12px",
                  left: "-24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  border: "1px solid #f1f5f9",
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 800,
                  }}
                >
                  2+
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Years</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Experience</div>
                </div>
              </motion.div>

              {/* Floating badge — Certified */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  border: "1px solid #f1f5f9",
                }}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  AZ
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>AZ-104</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Certified</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginTop: "80px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {[
            { n: "2+",   l: "Years Experience" },
            { n: "30+",  l: "Azure Resources Monitored" },
            { n: "100+", l: "Tickets Managed" },
            { n: "80%+", l: "L1 Incidents Resolved" },
          ].map(({ n, l }, i) => (
            <div
              key={n}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px 16px",
                textAlign: "center",
                background: "#fff",
                borderLeft: i > 0 ? "1px solid #e2e8f0" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#1e6bff",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {n}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#94a3b8" }}>{l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        #hero-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) {
          #hero-grid {
            grid-template-columns: 1fr;
          }
          #hero-grid > div:last-child {
            order: -1;
          }
        }
        @media (max-width: 600px) {
          #hero-grid > div:last-child > div > div[style*="width: 340px"] {
            width: 260px !important;
            height: 260px !important;
          }
        }
      `}</style>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
