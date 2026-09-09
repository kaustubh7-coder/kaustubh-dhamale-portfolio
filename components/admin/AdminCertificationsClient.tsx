"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, AlertCircle, Loader2, Award, ExternalLink, Upload, CheckCircle, FileText } from "lucide-react";

interface Cert {
  id: string;
  title: string;
  code: string;
  issuer: string;
  badge: string;
  color: string;
  description: string;
  credlyUrl: string | null;
  issueDate: string | null;
  sortOrder: number;
}

type FormState = {
  title: string; code: string; issuer: string; badge: string;
  color: string; description: string; credlyUrl: string; issueDate: string; sortOrder: number;
};

const EMPTY: FormState = {
  title: "", code: "", issuer: "", badge: "", color: "#1e6bff",
  description: "", credlyUrl: "", issueDate: "", sortOrder: 0,
};

const PRESET_COLORS = ["#0078d4","#c74634","#ff9900","#f05032","#10b981","#6366f1","#1e6bff","#8b5cf6"];

const inputStyle = {
  width: "100%", background: "#0d1117", border: "1px solid #2a3340",
  borderRadius: "10px", padding: "11px 14px", fontSize: "14px", color: "#e6edf3",
  outline: "none", transition: "border-color 0.15s",
};
const labelStyle = {
  display: "block" as const, fontSize: "12px", fontWeight: 600 as const,
  color: "#8b949e", marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.05em",
};

export function AdminCertificationsClient() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cert | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Resume upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/certifications");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to load certifications.");
      } else {
        setCerts(data);
      }
    } catch { setError("Failed to load certifications."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(""); setModalOpen(true); };
  const openEdit = (c: Cert) => {
    setEditing(c);
    setForm({ title: c.title, code: c.code, issuer: c.issuer, badge: c.badge, color: c.color,
      description: c.description, credlyUrl: c.credlyUrl ?? "", issueDate: c.issueDate ?? "", sortOrder: c.sortOrder });
    setFormError(""); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim()) { setFormError("Title and issuer are required."); return; }
    setSaving(true); setFormError("");
    try {
      const payload = { ...form, credlyUrl: form.credlyUrl.trim() || null, issueDate: form.issueDate.trim() || null,
        badge: form.badge.trim() || form.issuer.slice(0, 3).toUpperCase() };
      const res = editing
        ? await fetch(`/api/admin/certifications/${editing.id}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/certifications",                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
      await fetch(`/api/admin/certifications/${deleteId}`, { method: "DELETE" });
      setDeleteId(null); load();
    } catch { setError("Delete failed."); }
    finally { setDeleting(false); }
  };

  const uploadResume = async (file: File) => {
    if (file.type !== "application/pdf") { setUploadMsg({ type: "error", text: "Only PDF files are allowed." }); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadMsg({ type: "error", text: "File too large (max 10 MB)." }); return; }
    setUploading(true); setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await fetch("/api/admin/resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setUploadMsg({ type: "error", text: data.error ?? "Upload failed." }); return; }
      setUploadMsg({ type: "success", text: "Resume updated successfully! Visitors will now download the new file." });
    } catch { setUploadMsg({ type: "error", text: "Network error. Try again." }); }
    finally { setUploading(false); }
  };

  return (
    <>
      {/* ── Resume Upload Section ── */}
      <div style={{ background: "#161b22", border: "1px solid #2a3340", borderRadius: "14px", padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <FileText style={{ width: "18px", height: "18px", color: "#1e6bff" }} />
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3" }}>Resume</h2>
        </div>
        <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "20px" }}>
          Upload a new PDF to replace the resume visitors download from your portfolio.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadResume(f); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#1e6bff" : "#2a3340"}`,
            borderRadius: "12px", padding: "32px",
            textAlign: "center", cursor: "pointer",
            background: dragOver ? "rgba(30,107,255,0.06)" : "#0d1117",
            transition: "all 0.15s",
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadResume(f); e.target.value = ""; }} />
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Loader2 style={{ width: "28px", height: "28px", color: "#1e6bff", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "14px", color: "#8b949e" }}>Uploading…</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Upload style={{ width: "28px", height: "28px", color: "#4d5966" }} />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#e6edf3", marginBottom: "4px" }}>
                  Drop PDF here or click to browse
                </p>
                <p style={{ fontSize: "12px", color: "#4d5966" }}>PDF only · max 10 MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload feedback */}
        {uploadMsg && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "14px",
              padding: "12px 14px", borderRadius: "10px",
              background: uploadMsg.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${uploadMsg.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              color: uploadMsg.type === "success" ? "#34d399" : "#f87171",
              fontSize: "13px",
            }}>
            {uploadMsg.type === "success"
              ? <CheckCircle style={{ width: "15px", height: "15px", flexShrink: 0, marginTop: "1px" }} />
              : <AlertCircle style={{ width: "15px", height: "15px", flexShrink: 0, marginTop: "1px" }} />}
            {uploadMsg.text}
          </motion.div>
        )}
      </div>

      {/* ── Certifications header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Award style={{ width: "16px", height: "16px", color: "#1e6bff" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e6bff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Manage</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.02em", marginBottom: "4px" }}>Certifications</h1>
          <p style={{ fontSize: "14px", color: "#8b949e" }}>{certs.length} certification{certs.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px", borderRadius: "10px",
          background: "linear-gradient(135deg, #1e6bff, #1252cc)", color: "#fff", fontSize: "14px",
          fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(30,107,255,0.35)",
        }}>
          <Plus style={{ width: "16px", height: "16px" }} /> Add Certification
        </button>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertCircle style={{ width: "15px", height: "15px", flexShrink: 0 }} />
            {error}
          </div>
          <button onClick={load} style={{ padding: "5px 14px", borderRadius: "7px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: "12px", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
          <Loader2 style={{ width: "24px", height: "24px", color: "#1e6bff", animation: "spin 1s linear infinite" }} />
        </div>
      ) : certs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", borderRadius: "14px", border: "1px dashed #2a3340" }}>
          <Award style={{ width: "32px", height: "32px", color: "#4d5966", margin: "0 auto 12px" }} />
          <p style={{ color: "#8b949e", fontSize: "15px", marginBottom: "20px" }}>No certifications yet</p>
          <button onClick={openCreate} style={{ padding: "10px 22px", borderRadius: "9px", background: "#1e6bff", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Add Certification
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
          {certs.sort((a, b) => a.sortOrder - b.sortOrder).map(cert => (
            <motion.div key={cert.id} layout style={{
              background: "#161b22", border: "1px solid #2a3340", borderRadius: "14px",
              overflow: "hidden", display: "flex", flexDirection: "column",
            }}>
              {/* Color stripe */}
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${cert.color}, ${cert.color}55)` }} />

              <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                      background: `${cert.color}15`, border: `1px solid ${cert.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", fontWeight: 800, color: cert.color, fontFamily: "monospace",
                    }}>
                      {cert.badge}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#e6edf3", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cert.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "#8b949e" }}>{cert.issuer}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "9999px", background: `${cert.color}12`, color: cert.color, flexShrink: 0 }}>
                    {cert.code}
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "#8b949e", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {cert.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "4px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {cert.credlyUrl && (
                      <a href={cert.credlyUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#58a6ff", textDecoration: "none" }}>
                        <ExternalLink style={{ width: "11px", height: "11px" }} /> Credly
                      </a>
                    )}
                    {cert.issueDate && <span style={{ fontSize: "11px", color: "#4d5966" }}>{cert.issueDate}</span>}
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => openEdit(cert)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#e6edf3"; }} onMouseLeave={e => { e.currentTarget.style.color = "#8b949e"; }}>
                      <Pencil style={{ width: "12px", height: "12px" }} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(cert.id)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", background: "transparent", border: "1px solid #2a3340", color: "#8b949e", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b949e"; e.currentTarget.style.borderColor = "#2a3340"; }}>
                      <Trash2 style={{ width: "12px", height: "12px" }} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", background: "#161b22", border: "1px solid #2a3340", borderRadius: "18px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>

              <div style={{ position: "sticky", top: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #2a3340", background: "#161b22", zIndex: 1 }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3" }}>{editing ? "Edit Certification" : "Add Certification"}</h2>
                <button onClick={() => setModalOpen(false)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#1c2230", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e" }}>
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {formError && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "9px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px" }}>
                    <AlertCircle style={{ width: "14px", height: "14px" }} />{formError}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Title *</label>
                  <input type="text" placeholder="e.g. Azure Administrator Associate" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Issuer *</label>
                    <input type="text" placeholder="e.g. Microsoft" value={form.issuer}
                      onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Code / Year</label>
                    <input type="text" placeholder="e.g. AZ-104" value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Badge Text</label>
                    <input type="text" placeholder="e.g. MS (auto from issuer)" value={form.badge}
                      onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Issue Date</label>
                    <input type="text" placeholder="e.g. Jan 2025" value={form.issueDate}
                      onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea rows={3} placeholder="What this certification covers…" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                <div>
                  <label style={labelStyle}>Credly / Credential URL</label>
                  <input type="url" placeholder="https://www.credly.com/badges/…" value={form.credlyUrl}
                    onChange={e => setForm(f => ({ ...f, credlyUrl: e.target.value }))} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>

                {/* Color picker */}
                <div>
                  <label style={labelStyle}>Badge Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                        width: "28px", height: "28px", borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                        outline: form.color === c ? `3px solid ${c}` : "none", outlineOffset: "2px",
                        transform: form.color === c ? "scale(1.15)" : "scale(1)", transition: "transform 0.15s",
                      }} title={c} />
                    ))}
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      style={{ width: "28px", height: "28px", borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: "none" }} title="Custom color" />
                  </div>
                  {/* Preview */}
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `${form.color}18`, border: `1px solid ${form.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, color: form.color, fontFamily: "monospace" }}>
                      {form.badge || form.issuer.slice(0, 3).toUpperCase() || "???"}
                    </div>
                    <span style={{ fontSize: "12px", color: "#8b949e" }}>Badge preview</span>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input type="number" min={0} value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"} onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                </div>
              </div>

              <div style={{ position: "sticky", bottom: 0, display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid #2a3340", background: "#161b22" }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 22px", borderRadius: "9px", background: "linear-gradient(135deg, #1e6bff, #1252cc)", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                  {saving && <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />}
                  {editing ? "Save Changes" : "Add Certification"}
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3", marginBottom: "8px" }}>Delete Certification</h3>
              <p style={{ fontSize: "14px", color: "#8b949e", marginBottom: "24px", lineHeight: 1.6 }}>This will permanently remove the certification from your portfolio.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleDelete} disabled={deleting} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "9px", background: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}>
                  {deleting && <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />}Delete
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
