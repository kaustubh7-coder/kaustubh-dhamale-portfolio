"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CERTS = [
  {
    title:  "Azure Administrator Associate",
    code:   "AZ-104",
    issuer: "Microsoft",
    badge:  "MS",
    color:  "#0078d4",
    desc:   "Validates skills in implementing, managing and monitoring Azure environments — compute, storage, networking and identity.",
  },
  {
    title:  "OCI DevOps Professional",
    code:   "OCI 2025",
    issuer: "Oracle",
    badge:  "OCI",
    color:  "#c74634",
    desc:   "Oracle Cloud Infrastructure DevOps — CI/CD pipelines, container services and deployment automation.",
  },
  {
    title:  "OCI Multicloud Architect Professional",
    code:   "OCI 2025",
    issuer: "Oracle",
    badge:  "OCI",
    color:  "#c74634",
    desc:   "Multicloud architecture patterns, interconnecting OCI with other cloud providers and resilient distributed systems.",
  },
  {
    title:  "OCI Foundations Associate",
    code:   "OCI 2025",
    issuer: "Oracle",
    badge:  "OCI",
    color:  "#c74634",
    desc:   "Foundational Oracle Cloud Infrastructure services, core concepts, pricing and support models.",
  },
  {
    title:  "AWS with DevOps",
    code:   "AWS",
    issuer: "Naresh IT",
    badge:  "AWS",
    color:  "#ff9900",
    desc:   "AWS services with DevOps practices — CI/CD, infrastructure as code, monitoring and automation pipelines.",
  },
  {
    title:  "Git and GitHub for Developers",
    code:   "GIT",
    issuer: "Infosys Springboard",
    badge:  "GIT",
    color:  "#f05032",
    desc:   "Version control fundamentals, branching strategies, pull requests and GitHub Actions workflows.",
  },
];

export function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      id="certifications"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ background: "#ffffff", padding: "96px 0" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 40px" }}>

        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1e6bff", marginBottom: "12px" }}>
            Certifications
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: "16px" }}>
            Credentials
          </h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        <div style={{ display: "grid", gap: "20px" }} id="cert-grid">
          {CERTS.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)";
              }}
            >
              {/* Top stripe */}
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${cert.color}, ${cert.color}40)` }} aria-hidden />

              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                    background: `${cert.color}12`, border: `1px solid ${cert.color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 800, color: cert.color, fontFamily: "monospace",
                  }}>
                    {cert.badge}
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px",
                    background: `${cert.color}10`, color: cert.color,
                  }}>
                    {cert.code}
                  </span>
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "6px", lineHeight: 1.4 }}>
                  {cert.title}
                </h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px" }}>{cert.issuer}</p>
                <p style={{ fontSize: "12px", lineHeight: 1.6, color: "#64748b" }}>{cert.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        #cert-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px)  { #cert-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  { #cert-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.section>
  );
}
