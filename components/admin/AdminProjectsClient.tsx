"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, AlertCircle, Loader2, FolderGit2, Star, GitBranch, Globe, ChevronDown } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  technologies: string[];
  sortOrder: number;
}

type FormState = {
  title: string; slug: string; description: string; longDescription: string;
  image: string; githubUrl: string; liveUrl: string;
  featured: boolean; technologies: string; sortOrder: number;
};

const EMPTY: FormState = {
  title: "", slug: "", description: "", longDescription: "",
  image: "", githubUrl: "", liveUrl: "",
  featured: false, technologies: "", sortOrder: 0,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inputStyle = {
  width: "100%", background: "#0d1117",
  border: "1px solid #2a3340", borderRadius: "10px",
  padding: "11px 14px", fontSize: "14px", color: "#e6edf3",
  outline: "none", transition: "border-color 0.15s",
};
const labelStyle = {
  display: "block" as const, fontSize: "12px", fontWeight: 600,
  color: "#8b949e", marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.05em",
};

export function AdminProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error();
      setProjects(await res.json());
    } catch { setError("Failed to load projects."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(""); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, description: p.description,
      longDescription: p.longDescription ?? "", image: p.image ?? "",
      githubUrl: p.githubUrl ?? "", liveUrl: p.liveUrl ?? "",
      featured: p.featured, technologies: p.technologies.join(", "), sortOrder: p.sortOrder,
    });
    setFormError(""); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) { setFormError("Title and description are required."); return; }
    setSaving(true); setFormError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        description: form.description.trim(),
        longDescription: form.longDescription.trim() || null,
        image: form.image.trim() || null,
        githubUrl: form.githubUrl.trim() || null,
        liveUrl: form.liveUrl.trim() || null,
        featured: form.featured,
        technologies: form.technologies ? form.technologies.split(",").map(t => t.trim()).filter(Boolean) : [],
        sortOrder: form.sortOrder,
      };
      const res = editing
        ? await fetch(`/api/admin/projects/${editing.id}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/projects",               { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Save failed."); return; }
      setModalOpen(false); load();
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
      setDeleteId(null); load();
    } catch { setError("Delete failed."); }
    finally { setDeleting(false); }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <FolderGit2 style={{ width: "16px", height: "16px", color: "#1e6bff" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e6bff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Manage</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.02em", marginBottom: "4px" }}>Projects</h1>
          <p style={{ fontSize: "14px", color: "#8b949e" }}>{projects.length} project{projects.length !== 1 ? "s" : ""} in your portfolio</p>
        </div>
        <button onClick={openCreate} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "11px 20px", borderRadius: "10px",
          background: "linear-gradient(135deg, #1e6bff, #1252cc)",
          color: "#fff", fontSize: "14px", fontWeight: 600,
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 14px rgba(30,107,255,0.35)",
        }}>
          <Plus style={{ width: "16px", height: "16px" }} /> Add Project
        </button>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
          <AlertCircle style={{ width: "15px", height: "15px", flexShrink: 0 }} />{error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
          <Loader2 style={{ width: "24px", height: "24px", color: "#1e6bff", animation: "spin 1s linear infinite" }} />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", borderRadius: "14px", border: "1px dashed #2a3340" }}>
          <FolderGit2 style={{ width: "32px", height: "32px", color: "#4d5966", margin: "0 auto 12px" }} />
          <p style={{ color: "#8b949e", fontSize: "15px", marginBottom: "4px" }}>No projects yet</p>
          <p style={{ color: "#4d5966", fontSize: "13px", marginBottom: "20px" }}>Add your first project to showcase your work</p>
          <button onClick={openCreate} style={{ padding: "10px 22px", borderRadius: "9px", background: "#1e6bff", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Add Project
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {projects.sort((a, b) => a.sortOrder - b.sortOrder).map(p => (
            <motion.div key={p.id} layout style={{ background: "#161b22", border: "1px solid #2a3340", borderRadius: "14px", padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
              {/* Icon */}
              <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: "rgba(30,107,255,0.12)", border: "1px solid rgba(30,107,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FolderGit2 style={{ width: "20px", height: "20px", color: "#1e6bff" }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#e6edf3" }}>{p.title}</span>
                  {p.featured && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px", background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                      <Star style={{ width: "10px", height: "10px" }} /> Featured
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {p.description}
                </p>

                {/* Technologies */}
                {p.technologies.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                    {p.technologies.map(t => (
                      <span key={t} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "9999px", background: "#1c2230", color: "#8b949e", border: "1px solid #2a3340" }}>{t}</span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div style={{ display: "flex", gap: "12px" }}>
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#58a6ff", textDecoration: "none" }}>
                      <GitBranch style={{ width: "13px", height: "13px" }} /> GitHub
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#58a6ff", textDecoration: "none" }}>
                      <Globe style={{ width: "13px", height: "13px" }} /> Live
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => openEdit(p)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e6edf3"; e.currentTarget.style.borderColor = "#3d4d5c"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#8b949e"; e.currentTarget.style.borderColor = "#2a3340"; }}>
                  <Pencil style={{ width: "13px", height: "13px" }} /> Edit
                </button>
                <button onClick={() => setDeleteId(p.id)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "transparent", border: "1px solid #2a3340", color: "#8b949e", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b949e"; e.currentTarget.style.borderColor = "#2a3340"; }}>
                  <Trash2 style={{ width: "13px", height: "13px" }} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", background: "#161b22", border: "1px solid #2a3340", borderRadius: "18px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>

              {/* Sticky header */}
              <div style={{ position: "sticky", top: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #2a3340", background: "#161b22", zIndex: 1 }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3" }}>{editing ? "Edit Project" : "Add New Project"}</h2>
                <button onClick={() => setModalOpen(false)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#1c2230", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e" }}>
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                {formError && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "9px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px" }}>
                    <AlertCircle style={{ width: "14px", height: "14px", flexShrink: 0 }} />{formError}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input type="text" placeholder="Project title" value={form.title}
                    onChange={e => { const v = e.target.value; setForm(f => ({ ...f, title: v, slug: f.slug || slugify(v) })); }}
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                {/* Slug */}
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input type="text" placeholder="auto-generated from title" value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Short Description *</label>
                  <textarea rows={3} placeholder="Brief overview of the project" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                {/* Long description */}
                <div>
                  <label style={labelStyle}>Full Description</label>
                  <textarea rows={4} placeholder="Detailed project description (optional)" value={form.longDescription}
                    onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                {/* Technologies */}
                <div>
                  <label style={labelStyle}>Technologies</label>
                  <input type="text" placeholder="Azure, Terraform, Linux, Docker" value={form.technologies}
                    onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))}
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  <p style={{ fontSize: "11px", color: "#4d5966", marginTop: "5px" }}>Separate with commas</p>
                </div>

                {/* URLs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>GitHub URL</label>
                    <input type="url" placeholder="https://github.com/…" value={form.githubUrl}
                      onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                      style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Live URL</label>
                    <input type="url" placeholder="https://…" value={form.liveUrl}
                      onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))}
                      style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label style={labelStyle}>Image URL</label>
                  <input type="url" placeholder="https://…/image.png" value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                {/* Sort + Featured */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "14px", alignItems: "end" }}>
                  <div>
                    <label style={labelStyle}>Sort Order</label>
                    <input type="number" min={0} value={form.sortOrder}
                      onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                      style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", paddingBottom: "11px" }}>
                    <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))} style={{
                      width: "44px", height: "24px", borderRadius: "9999px", position: "relative", cursor: "pointer", flexShrink: 0,
                      background: form.featured ? "#1e6bff" : "#1c2230",
                      border: `1px solid ${form.featured ? "#1e6bff" : "#2a3340"}`,
                      transition: "background 0.2s",
                    }}>
                      <div style={{
                        position: "absolute", top: "3px", width: "16px", height: "16px", borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s",
                        left: form.featured ? "23px" : "3px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#e6edf3", userSelect: "none" }}>Featured</span>
                  </label>
                </div>
              </div>

              {/* Sticky footer */}
              <div style={{ position: "sticky", bottom: 0, display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid #2a3340", background: "#161b22" }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 22px", borderRadius: "9px",
                  background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                  color: "#fff", fontSize: "13px", fontWeight: 600,
                  border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
                }}>
                  {saving && <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />}
                  {editing ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              style={{ width: "100%", maxWidth: "360px", background: "#161b22", border: "1px solid #2a3340", borderRadius: "16px", padding: "28px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Trash2 style={{ width: "20px", height: "20px", color: "#f87171" }} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3", marginBottom: "8px" }}>Delete Project</h3>
              <p style={{ fontSize: "14px", color: "#8b949e", marginBottom: "24px", lineHeight: 1.6 }}>
                This project will be permanently removed from your portfolio.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px", borderRadius: "9px", background: "#dc2626",
                  color: "#fff", fontSize: "13px", fontWeight: 600, border: "none",
                  cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1,
                }}>
                  {deleting && <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
