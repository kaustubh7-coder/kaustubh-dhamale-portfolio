"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { MapPin, Mail, Phone, GraduationCap, Briefcase, Award } from "lucide-react";

const INFO = [
  { icon: MapPin,        label: "Location",      value: "Pune, Maharashtra, India" },
  { icon: Mail,          label: "Email",         value: "kaustubhdhamale.work@gmail.com", href: "mailto:kaustubhdhamale.work@gmail.com" },
  { icon: Phone,         label: "Phone",         value: "+91-9370614621",                 href: "tel:+919370614621" },
  { icon: GraduationCap, label: "Education",     value: "B.E. Electronics & CS · Mumbai University · 2022–2026" },
  { icon: Briefcase,     label: "Company",       value: "Zsoft Technology Services, Hyderabad" },
  { icon: Award,         label: "Certification", value: "Microsoft Certified: AZ-104 Azure Administrator" },
];

const TAGS = [
  { name: "Microsoft Azure",     color: "#0078d4" },
  { name: "Azure Monitor",       color: "#0078d4" },
  { name: "Log Analytics",       color: "#0ea5e9" },
  { name: "Azure Entra ID",      color: "#0078d4" },
  { name: "Terraform",           color: "#7c3aed" },
  { name: "PowerShell",          color: "#2563eb" },
  { name: "Azure CLI",           color: "#0078d4" },
  { name: "Linux",               color: "#ea580c" },
  { name: "Windows Server",      color: "#0078d4" },
  { name: "Docker",              color: "#0ea5e9" },
  { name: "Incident Management", color: "#d97706" },
  { name: "ServiceNow / Jira",   color: "#16a34a" },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const card: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 2px 12px var(--card-shadow)",
  };

  return (
    <motion.section id="about" ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      style={{ background: "var(--section-bg-alt)", padding: "96px 0" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "12px" }}>About Me</p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "16px" }}>
            Passionate about Cloud Infrastructure
          </h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        <div id="about-grid" style={{ display: "grid", gap: "28px", alignItems: "start" }}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={card}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--heading)", marginBottom: "20px" }}>My Background</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px", lineHeight: 1.8, color: "var(--body)" }}>
                <p>I&apos;m an <strong style={{ color: "var(--heading)" }}>Azure Cloud Support Engineer</strong> with 2+ years of experience at Zsoft Technology Services — monitoring 30+ Azure resources daily and resolving 80%+ of L1 infrastructure incidents within SLA timelines.</p>
                <p>My work spans Azure Monitor, Log Analytics, Application Insights, VM management, Storage Accounts, VNets, NSGs, and identity via Azure Entra ID and Key Vault. I reduced average triage time by <strong style={{ color: "var(--heading)" }}>25%</strong> through structured runbooks and authored SOPs used across the team.</p>
                <p>I provision infrastructure with <strong style={{ color: "var(--heading)" }}>Terraform</strong> and Azure CLI, automate health checks with PowerShell and Bash, and manage 100+ tickets through ServiceNow and Jira.</p>
              </div>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--heading)", marginBottom: "20px" }}>Quick Info</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: "16px", height: "16px", color: "var(--blue)" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                      {href
                        ? <a href={href} style={{ fontSize: "13px", color: "var(--body)", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--blue)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--body)")}>{value}</a>
                        : <span style={{ fontSize: "13px", color: "var(--body)" }}>{value}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={card}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--heading)", marginBottom: "20px" }}>Core Expertise</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TAGS.map(({ name, color }) => (
                  <span key={name} style={{ padding: "6px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}25` }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {[
              { n: "30+",  l: "Azure Resources",    d: "Monitored daily with custom alert rules and dashboards",       c: "#1e6bff" },
              { n: "80%+", l: "Incident Resolution", d: "L1 incidents resolved within SLA — no unnecessary escalation", c: "#0ea5e9" },
              { n: "25%",  l: "Faster Triage",       d: "Reduction in diagnosis time through structured runbooks",       c: "#7c3aed" },
            ].map(({ n, l, d, c }) => (
              <div key={n} style={{ ...card, display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ fontSize: "36px", fontWeight: 900, color: c, lineHeight: 1, flexShrink: 0 }}>{n}</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--heading)", marginBottom: "4px" }}>{l}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        #about-grid { grid-template-columns: 3fr 2fr; }
        @media (max-width: 900px) { #about-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { #about-grid > div:first-child > div:last-child > div > div { grid-template-columns: 1fr !important; } }
      `}</style>
    </motion.section>
  );
}
