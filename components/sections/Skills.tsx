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
    <motion.section
      id="skills"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ background: "#ffffff", padding: "96px 0" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 40px" }}>

        {/* Heading */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1e6bff", marginBottom: "12px" }}>
            Technical Skills
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: "16px" }}>
            What I Work With
          </h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        {/* Category filter tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }} role="tablist">
          {["All", ...cats].map(tab => {
            const c = CAT_COLOR[tab] ?? "#1e6bff";
            const isActive = active === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.15s ease",
                  background: isActive ? `${c}15` : "#f8fafc",
                  color: isActive ? c : "#64748b",
                  outline: isActive ? `1.5px solid ${c}30` : "1.5px solid #e2e8f0",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(3, 1fr)" }}
            id="skills-grid"
          >
            {shown.map((skill, i) => {
              const c = CAT_COLOR[skill.category] ?? "#1e6bff";
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.015, duration: 0.2 }}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px 22px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)";
                  }}
                >
                  {/* Name + percentage */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{skill.name}</h3>
                    <span style={{
                      fontSize: "12px", fontWeight: 700, padding: "3px 8px", borderRadius: "8px",
                      background: `${c}12`, color: c,
                    }}>{skill.proficiency}%</span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{ height: "5px", borderRadius: "9999px", background: "#f1f5f9", overflow: "hidden", marginBottom: "12px" }}
                    role="progressbar"
                    aria-valuenow={skill.proficiency}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} proficiency`}
                  >
                    <motion.div
                      style={{ height: "100%", borderRadius: "9999px", background: `linear-gradient(90deg, ${c}, ${c}80)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 0.7, delay: i * 0.015, ease: "easeOut" }}
                    />
                  </div>

                  {/* Category badge */}
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "9999px",
                    background: `${c}10`, color: c,
                  }}>
                    {skill.category}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {skills.length === 0 && (
          <div style={{
            textAlign: "center", padding: "64px 0", borderRadius: "16px",
            background: "#f8fafc", border: "1px dashed #e2e8f0", color: "#94a3b8",
          }}>
            Skills will appear here once the database is connected.
          </div>
        )}
      </div>

      <style>{`
        #skills-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1024px) { #skills-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { #skills-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.section>
  );
}
