"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, Building2 } from "lucide-react";

const JOBS = [
  {
    role: "L1 Cloud Support Engineer", company: "Zsoft Technology Services",
    loc: "Hyderabad", period: "Sep 2024 – Sep 2026", type: "Full-time",
    current: true, color: "#1e6bff",
    metrics: [
      { n: "30+", l: "Resources Monitored" }, { n: "80%+", l: "Incidents Resolved" },
      { n: "25%", l: "Faster Triage" },       { n: "100+", l: "Tickets Managed" },
    ],
    bullets: [
      "Monitored 30+ Azure resources (VMs, Storage, VNets, NSGs) using Azure Monitor and Log Analytics — investigating CPU, memory, disk and availability alerts daily.",
      "Resolved 80%+ of L1 infrastructure incidents within SLA timelines — covering Azure VMs, storage access, service availability and network connectivity.",
      "Reduced average incident triage time by 25% through structured troubleshooting guides and faster escalation paths.",
      "Managed 100+ support tickets in ServiceNow/Jira with accurate categorisation, SLA tracking, priority assignment and resolution notes.",
      "Performed Linux and Windows Server administration: service checks, process monitoring, disk usage, file permissions and log analysis.",
      "Handled identity and access via Azure Entra ID and secure configuration management through Azure Key Vault.",
      "Authored SOPs and troubleshooting guides for recurring incidents, improving knowledge reuse across the team.",
    ],
    tech: ["Azure Monitor","Log Analytics","Azure VMs","Storage Accounts","VNets","NSGs","Azure Entra ID","Key Vault","ServiceNow","Jira","Linux","Windows Server","PowerShell","Terraform","Azure CLI"],
  },
  {
    role: "Cloud Support Intern", company: "Zsoft Technology Services",
    loc: "Hyderabad", period: "Jun 2024 – Sep 2024", type: "Internship",
    current: false, color: "#0ea5e9", metrics: [],
    bullets: [
      "Assisted in monitoring Azure cloud resources using Azure Monitor and Log Analytics.",
      "Supported troubleshooting of Azure VMs, Storage Accounts, Blob Storage and network issues.",
      "Performed basic Linux and Windows administration including log analysis and service checks.",
      "Managed ServiceNow/Jira tickets — updates, categorisation, SLA tracking and escalation.",
      "Handled identity and access requests using Azure Entra ID.",
    ],
    tech: ["Azure Monitor","Log Analytics","Azure VMs","Blob Storage","Azure Entra ID","ServiceNow","Jira","Linux","Windows Server"],
  },
];

export function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section id="experience" ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      style={{ background: "var(--section-bg-alt)", padding: "72px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "10px" }}>Experience</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "14px" }}>Professional Journey</h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "12px", width: "2px", background: "linear-gradient(to bottom, transparent, #1e6bff 15%, #0ea5e9 85%, transparent)" }} aria-hidden />

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {JOBS.map((job, i) => (
              <motion.div key={job.role}
                initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.12, duration: 0.45 }}
                style={{ paddingLeft: "40px", position: "relative" }}>

                {/* Dot */}
                <div style={{ position: "absolute", left: "5px", top: "22px", width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${job.color}`, background: `${job.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: job.color }} />
                </div>

                {/* Card */}
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px var(--card-shadow)" }}>
                  <div style={{ height: "3px", background: `linear-gradient(90deg, ${job.color}, transparent)` }} aria-hidden />

                  <div style={{ padding: "20px" }}>
                    {/* Header */}
                    <div className="exp-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <h3 style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 900, color: "var(--heading)" }}>{job.role}</h3>
                          {job.current && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />Current
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: job.color }}>
                          <Building2 style={{ width: "14px", height: "14px" }} />
                          <span style={{ fontSize: "14px", fontWeight: 600 }}>{job.company}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "var(--body)" }}>
                          <Calendar style={{ width: "13px", height: "13px", flexShrink: 0 }} />{job.period}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "var(--body)" }}>
                          <MapPin style={{ width: "13px", height: "13px", flexShrink: 0 }} />{job.loc}
                        </div>
                        <span style={{ alignSelf: "flex-start", padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "var(--bg-soft)", color: "var(--body)", border: "1px solid var(--card-border)" }}>{job.type}</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    {job.metrics.length > 0 && (
                      <div className="exp-metrics" style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                        {job.metrics.map(({ n, l }) => (
                          <div key={n} style={{ borderRadius: "12px", padding: "12px", textAlign: "center", background: `${job.color}07`, border: `1px solid ${job.color}15` }}>
                            <div style={{ fontSize: "clamp(18px,4vw,22px)", fontWeight: 900, color: job.color }}>{n}</div>
                            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", lineHeight: 1.3 }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullets */}
                    <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", listStyle: "none", padding: 0 }}>
                      {job.bullets.map((b, bi) => (
                        <li key={bi} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", lineHeight: 1.7, color: "var(--body)" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: job.color, flexShrink: 0, marginTop: "9px" }} aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>

                    {/* Tech tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {job.tech.map(t => (
                        <span key={t} style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, background: `${job.color}08`, color: job.color, border: `1px solid ${job.color}15` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .exp-metrics { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 600px) {
          .exp-metrics { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </motion.section>
  );
}
