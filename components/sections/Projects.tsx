"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Star, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface Project {
  id: string; title: string; slug: string; description: string;
  longDescription: string | null; image: string | null; githubUrl: string | null;
  liveUrl: string | null; featured: boolean; technologies: string[];
}

function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "0" }}
      onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        style={{ position: "relative", width: "100%", maxWidth: "640px", maxHeight: "90svh", overflowY: "auto", borderRadius: "20px 20px 0 0", background: "var(--card-bg)", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
        onClick={e => e.stopPropagation()}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "9999px", background: "var(--border)" }} />
        </div>
        <div style={{ padding: "16px 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", gap: "12px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: "clamp(17px,4vw,20px)", fontWeight: 800, color: "var(--heading)", marginBottom: "8px" }}>{p.title}</h3>
              {p.featured && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: "var(--blue-soft)", color: "#1e6bff", border: "1px solid #bfdbfe" }}>
                  <Star style={{ width: "11px", height: "11px" }} /> Featured
                </span>
              )}
            </div>
            <button onClick={onClose} aria-label="Close"
              style={{ width: "40px", height: "40px", borderRadius: "10px", border: "none", background: "var(--bg-soft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)", flexShrink: 0 }}>
              <X style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
          <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--body)", marginBottom: "14px" }}>{p.description}</p>
          {p.longDescription && <p style={{ fontSize: "14px", lineHeight: 1.75, color: "var(--body)", marginBottom: "20px" }}>{p.longDescription}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
            {p.technologies.map(t => (
              <span key={t} style={{ padding: "5px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "var(--blue-soft)", color: "var(--blue)", border: "1px solid var(--border)" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, background: "var(--bg-soft)", color: "var(--heading)", border: "1px solid var(--border)", textDecoration: "none", minHeight: "48px" }}>
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, background: "linear-gradient(135deg, #1e6bff, #1252cc)", color: "#fff", textDecoration: "none", minHeight: "48px" }}>
                <ExternalLink style={{ width: "15px", height: "15px" }} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Card({ p, onClick }: { p: Project; onClick: () => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }}
      onClick={onClick} role="article" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick()}
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", boxShadow: "0 2px 12px var(--card-shadow)" }}>
      <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eff4ff 0%, #f0f9ff 100%)", position: "relative", flexShrink: 0 }}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e6bff", marginBottom: "6px", fontFamily: "monospace" }}>Azure Infrastructure</div>
            <div style={{ fontSize: "11px", color: "#93c5fd", lineHeight: 1.6, fontFamily: "monospace" }}>VMs → NSGs → VNets<br />Monitor → Log Analytics</div>
          </div>
        )}
        {p.featured && (
          <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: "#1e6bff", color: "#fff" }}>
            <Star style={{ width: "10px", height: "10px" }} /> Featured
          </div>
        )}
      </div>
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--heading)", marginBottom: "8px", lineHeight: 1.4 }}>{p.title}</h3>
        <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--body)", marginBottom: "14px", flex: 1 }}>{p.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
          {p.technologies.slice(0, 4).map(t => (
            <span key={t} style={{ padding: "3px 9px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, background: "var(--blue-soft)", color: "#1e6bff" }}>{t}</span>
          ))}
          {p.technologies.length > 4 && <span style={{ padding: "3px 9px", borderRadius: "9999px", fontSize: "11px", color: "var(--muted)", background: "var(--bg-soft)" }}>+{p.technologies.length - 4}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e6bff" }}>View Details →</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} aria-label="GitHub"
                style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)", background: "var(--bg-soft)", textDecoration: "none" }}>
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} aria-label="Live demo"
                style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)", background: "var(--bg-soft)", textDecoration: "none" }}>
                <ExternalLink style={{ width: "14px", height: "14px" }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState<Project | null>(null);
  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  return (
    <motion.section id="projects" ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      style={{ background: "var(--section-bg)", padding: "72px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "10px" }}>Projects</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "14px" }}>My Work</h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", borderRadius: "16px", background: "var(--bg-soft)", border: "1px dashed var(--border)" }}>
            <p style={{ color: "var(--muted)", fontSize: "15px" }}>Projects will appear once added via the admin panel.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {featured.length > 0 && (
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>Featured</p>
                <div id="proj-featured" style={{ display: "grid", gap: "20px" }}>
                  {featured.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }}>
                      <Card p={p} onClick={() => setSelected(p)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>More Projects</p>}
                <div id="proj-rest" style={{ display: "grid", gap: "20px" }}>
                  {rest.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.06 }}>
                      <Card p={p} onClick={() => setSelected(p)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        #proj-featured { grid-template-columns: repeat(2,1fr); }
        #proj-rest     { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 900px) {
          #proj-featured { grid-template-columns: 1fr; }
          #proj-rest     { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 540px) {
          #proj-rest { grid-template-columns: 1fr; }
        }
      `}</style>

      <AnimatePresence>
        {selected && <Modal p={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.section>
  );
}
