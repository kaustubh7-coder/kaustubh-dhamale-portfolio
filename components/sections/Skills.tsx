"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface Skill { id: string; name: string; category: string; proficiency: number; sortOrder: number; }

const CAT_COLOR: Record<string, string> = {
  "Cloud":               "#0078d4",
  "Monitoring":          "#0ea5e9",
  "Operating Systems":   "#16a34a",
  "Networking":          "#d97706",
  "Automation & IaC":    "#7c3aed",
  "Containers & Tools":  "#ea580c",
  "IT Operations":       "#db2777",
};

const ORDER = ["Cloud","Monitoring","Operating Systems","Networking","Automation & IaC","Containers & Tools","IT Operations"];

export function Skills({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const cats = Array.from(new Set(skills.map(s => s.category)))
    .sort((a, b) => (ORDER.indexOf(a) === -1 ? 99 : ORDER.indexOf(a)) - (ORDER.indexOf(b) === -1 ? 99 : ORDER.indexOf(b)));
  const [active, setActive] = useState("All");
  const shown = (active === "All" ? skills : skills.filter(s => s.category === active))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <motion.section id="skills" ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      style={{ background: "var(--section-bg)", padding: "72px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>

        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "10px" }}>Technical Skills</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "14px" }}>What I Work With</h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        {/* Scrollable filter tabs */}
        <div className="scroll-x" style={{ marginBottom: "28px", paddingBottom: "4px" }}>
          <div style={{ display: "flex", gap: "8px", width: "max-content", paddingRight: "4px" }} role="tablist">
            {["All", ...cats].map(tab => {
              const c = CAT_COLOR[tab] ?? "#1e6bff";
              const isActive = active === tab;
              return (
                <button key={tab} role="tab" aria-selected={isActive} onClick={() => setActive(tab)}
                  style={{
                    padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", border: "none", transition: "all 0.15s ease",
                    background: isActive ? `${c}15` : "var(--bg-soft)",
                    color: isActive ? c : "var(--text-2)",
                    outline: isActive ? `1.5px solid ${c}35` : "1.5px solid var(--border)",
                    whiteSpace: "nowrap", minHeight: "44px",
                  }}>
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            id="skills-grid" style={{ display: "grid", gap: "12px" }}>
            {shown.map((skill, i) => {
              const c = CAT_COLOR[skill.category] ?? "#1e6bff";
              return (
                <motion.div key={skill.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015, duration: 0.2 }}
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "16px 18px", boxShadow: "0 1px 6px var(--card-shadow)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--heading)" }}>{skill.name}</h3>
                    <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 8px", borderRadius: "8px", background: `${c}12`, color: c, flexShrink: 0, marginLeft: "8px" }}>{skill.proficiency}%</span>
                  </div>
                  <div style={{ height: "5px", borderRadius: "9999px", background: "var(--bg-soft)", overflow: "hidden", marginBottom: "10px" }}
                    role="progressbar" aria-valuenow={skill.proficiency} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div style={{ height: "100%", borderRadius: "9999px", background: `linear-gradient(90deg, ${c}, ${c}80)` }}
                      initial={{ width: 0 }} animate={{ width: `${skill.proficiency}%` }} transition={{ duration: 0.7, delay: i * 0.015, ease: "easeOut" }} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "9999px", background: `${c}10`, color: c }}>{skill.category}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {skills.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0", borderRadius: "16px", background: "var(--bg-soft)", border: "1px dashed var(--border)", color: "var(--muted)" }}>
            Skills will appear here once the database is connected.
          </div>
        )}
      </div>

      <style>{`
        #skills-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { #skills-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px)  { #skills-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.section>
  );
}
