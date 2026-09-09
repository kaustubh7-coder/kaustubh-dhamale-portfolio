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
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "relative", width: "100%", maxWidth: "640px", maxHeight: "90vh",
          overflowY: "auto", borderRadius: "20px", background: "var(--card-bg)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "36px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--heading)", marginBottom: "8px" }}>{p.title}</h3>
              {p.featured && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "4px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700,
                  background: "var(--blue-soft)", color: "#1e6bff", border: "1px solid #bfdbfe",
                }}>
                  <Star style={{ width: "11px", height: "11px" }} /> Featured
                </span>
              )}
            </div>
            <button onClick={onClose} aria-label="Close"
              style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "none",
                background: "var(--bg-soft)", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", color: "var(--body)", flexShrink: 0,
              }}>
              <X style={{ width: "18px", height: "18px" }} />
            </button>
          </div>

          <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--body)", marginBottom: "16px" }}>{p.description}</p>
          {p.longDescription && (
            <p style={{ fontSize: "14px", lineHeight: 1.75, color: "var(--body)", marginBottom: "24px" }}>{p.longDescription}</p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
            {p.technologies.map(t => (
              <span key={t} style={{ padding: "5px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: "var(--blue-soft)", color: "var(--blue)", border: "1px solid var(--border)" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, background: "var(--bg-soft)", color: "var(--heading)", border: "1px solid var(--border)", textDecoration: "none", transition: "transform 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                  color: "var(--card-bg)", textDecoration: "none", transition: "transform 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      role="article"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
      style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px",
        overflow: "hidden", display: "flex", flexDirection: "column",
        cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.18s",
      }}
    >
      {/* Image / placeholder */}
      <div style={{
        height: "180px", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #eff4ff 0%, #f0f9ff 100%)", position: "relative",
        flexShrink: 0,
      }}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e6bff", marginBottom: "8px", fontFamily: "monospace" }}>
              Azure Infrastructure
            </div>
            <div style={{ fontSize: "11px", color: "#93c5fd", lineHeight: 1.6, fontFamily: "monospace" }}>
              VMs → NSGs → VNets<br />Monitor → Log Analytics
            </div>
          </div>
        )}
        {p.featured && (
          <div style={{
            position: "absolute", top: "12px", right: "12px",
            display: "flex", alignItems: "center", gap: "5px",
            padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700,
            background: "#1e6bff", color: "var(--card-bg)",
          }}>
            <Star style={{ width: "11px", height: "11px" }} /> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--heading)", marginBottom: "10px", lineHeight: 1.4 }}>
          {p.title}
        </h3>
        <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--body)", marginBottom: "16px", flex: 1 }}>
          {p.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {p.technologies.slice(0, 4).map(t => (
            <span key={t} style={{
              padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600,
              background: "var(--blue-soft)", color: "#1e6bff",
            }}>{t}</span>
          ))}
          {p.technologies.length > 4 && (
            <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", color: "var(--muted)", background: "var(--bg-soft)" }}>
              +{p.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Footer row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "14px", borderTop: "1px solid var(--border)",
        }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e6bff" }}>View Details →</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()} aria-label="GitHub"
                style={{
                  width: "30px", height: "30px", borderRadius: "8px", display: "flex",
                  alignItems: "center", justifyContent: "center", color: "var(--body)",
                  background: "var(--bg-soft)", textDecoration: "none",
                }}>
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()} aria-label="Live demo"
                style={{
                  width: "30px", height: "30px", borderRadius: "8px", display: "flex",
                  alignItems: "center", justifyContent: "center", color: "var(--body)",
                  background: "var(--bg-soft)", textDecoration: "none",
                }}>
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
  const rest     = projects.filter(p => !p.featured);

  return (
    <motion.section
      id="projects"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ background: "var(--card-bg)", padding: "96px 0" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 40px" }}>

        {/* Heading */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1e6bff", marginBottom: "12px" }}>
            Projects
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "16px" }}>
            My Work
          </h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        {projects.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0", borderRadius: "16px",
            background: "var(--bg-soft)", border: "1px dashed #e2e8f0",
          }}>
            <p style={{ color: "var(--muted)", fontSize: "15px" }}>Projects will appear here once added via the admin panel.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {featured.length > 0 && (
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>
                  Featured
                </p>
                <div id="projects-featured-grid" style={{ display: "grid", gap: "24px" }}>
                  {featured.map((p, i) => (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.08 }}>
                      <Card p={p} onClick={() => setSelected(p)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>
                    More Projects
                  </p>
                )}
                <div id="projects-rest-grid" style={{ display: "grid", gap: "24px" }}>
                  {rest.map((p, i) => (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.06 }}>
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
        #projects-featured-grid { grid-template-columns: repeat(2, 1fr); }
        #projects-rest-grid     { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          #projects-featured-grid { grid-template-columns: 1fr; }
          #projects-rest-grid     { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          #projects-rest-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <AnimatePresence>
        {selected && <Modal p={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.section>
  );
}
