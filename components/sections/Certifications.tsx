"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Cert {
  id: string; title: string; code: string; issuer: string;
  badge: string; color: string; description: string;
  credlyUrl: string | null; issueDate: string | null;
}

const FALLBACK: Cert[] = [
  { id:"1", title:"Azure Administrator Associate", code:"AZ-104", issuer:"Microsoft", badge:"MS", color:"#0078d4", description:"Validates skills in implementing, managing and monitoring Azure environments — compute, storage, networking and identity.", credlyUrl:null, issueDate:null },
  { id:"2", title:"OCI DevOps Professional", code:"OCI 2025", issuer:"Oracle", badge:"OCI", color:"#c74634", description:"Oracle Cloud Infrastructure DevOps — CI/CD pipelines, container services and deployment automation.", credlyUrl:null, issueDate:null },
  { id:"3", title:"OCI Multicloud Architect Professional", code:"OCI 2025", issuer:"Oracle", badge:"OCI", color:"#c74634", description:"Multicloud architecture patterns, interconnecting OCI with other cloud providers.", credlyUrl:null, issueDate:null },
  { id:"4", title:"OCI Foundations Associate", code:"OCI 2025", issuer:"Oracle", badge:"OCI", color:"#c74634", description:"Foundational Oracle Cloud Infrastructure services, core concepts, pricing and support.", credlyUrl:null, issueDate:null },
  { id:"5", title:"AWS with DevOps", code:"AWS", issuer:"Naresh IT", badge:"AWS", color:"#ff9900", description:"AWS services with DevOps practices — CI/CD, infrastructure as code, monitoring and automation.", credlyUrl:null, issueDate:null },
  { id:"6", title:"Git and GitHub for Developers", code:"GIT", issuer:"Infosys Springboard", badge:"GIT", color:"#f05032", description:"Version control fundamentals, branching strategies, pull requests and GitHub Actions workflows.", credlyUrl:null, issueDate:null },
];

export function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [certs, setCerts] = useState<Cert[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/certifications")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setCerts(data); })
      .catch(() => {});
  }, []);

  return (
    <motion.section id="certifications" ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      style={{ background: "var(--section-bg-alt)", padding: "72px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "10px" }}>Certifications</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "14px" }}>Credentials</h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        <div id="cert-grid" style={{ display: "grid", gap: "16px" }}>
          {certs.map((cert, i) => (
            <motion.div key={cert.id}
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.06, duration: 0.4 }}
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 10px var(--card-shadow)", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${cert.color}, ${cert.color}40)` }} aria-hidden />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0, background: `${cert.color}12`, border: `1px solid ${cert.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, color: cert.color, fontFamily: "monospace" }}>
                    {cert.badge}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {cert.issueDate && <span style={{ fontSize: "11px", color: "var(--muted)" }}>{cert.issueDate}</span>}
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px", background: `${cert.color}10`, color: cert.color }}>{cert.code}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--heading)", marginBottom: "4px", lineHeight: 1.4 }}>{cert.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>{cert.issuer}</p>
                <p style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--body)" }}>{cert.description}</p>
                {cert.credlyUrl && (
                  <a href={cert.credlyUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "10px", fontSize: "12px", fontWeight: 600, color: cert.color, textDecoration: "none", minHeight: "44px" }}>
                    <ExternalLink style={{ width: "12px", height: "12px" }} /> View credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        #cert-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 900px) { #cert-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 500px) { #cert-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.section>
  );
}
