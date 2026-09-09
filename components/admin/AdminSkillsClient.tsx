"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, AlertCircle, Loader2, Wrench, ChevronDown } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  proficiency: number;
  sortOrder: number;
}

type FormState = { name: string; category: string; proficiency: number; sortOrder: number };

const EMPTY: FormState = { name: "", category: "", proficiency: 80, sortOrder: 0 };

const CATEGORIES = [
  "Cloud", "Monitoring", "Operating Systems", "Networking",
  "Automation & IaC", "Containers & Tools", "IT Operations",
];

const CAT_COLORS: Record<string, string> = {
  "Cloud":               "#1e6bff",
  "Monitoring":          "#10b981",
  "Operating Systems":   "#f59e0b",
  "Networking":          "#6366f1",
  "Automation & IaC":    "#ec4899",
  "Containers & Tools":  "#0ea5e9",
  "IT Operations":       "#8b5cf6",
};

/* ── shared styles ── */
const inputStyle = {
  width: "100%", background: "#0d1117",
  border: "1px solid #2a3340", borderRadius: "10px",
  padding: "11px 14px", fontSize: "14px", color: "#e6edf3",
  outline: "none", transition: "border-color 0.15s",
};

export function AdminSkillsClient() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      if (!res.ok) throw new Error();
      setSkills(await res.json());
    } catch { setError("Failed to load skills."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const categories = ["All", ...CATEGORIES.filter(c => grouped[c]?.length)];
  const visibleGroups = activeCat === "All"
    ? Object.entries(grouped)
    : Object.entries(grouped).filter(([cat]) => cat === activeCat);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(""); setModalOpen(true); };
  const openEdit   = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, sortOrder: s.sortOrder });
    setFormError(""); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category) { setFormError("Name and category are required."); return; }
    setSaving(true); setFormError("");
    try {
      const res = editing
        ? await fetch(`/api/admin/skills/${editing.id}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch("/api/admin/skills",                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
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
      await fetch(`/api/admin/skills/${deleteId}`, { method: "DELETE" });
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
            <Wrench style={{ width: "16px", height: "16px", color: "#1e6bff" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e6bff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Manage</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.02em", marginBottom: "4px" }}>Skills</h1>
          <p style={{ fontSize: "14px", color: "#8b949e" }}>{skills.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <button onClick={openCreate} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "11px 20px", borderRadius: "10px",
          background: "linear-gradient(135deg, #1e6bff, #1252cc)",
          color: "#fff", fontSize: "14px", fontWeight: 600,
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 14px rgba(30,107,255,0.35)",
        }}>
          <Plus style={{ width: "16px", height: "16px" }} /> Add Skill
        </button>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "20px" }} role="alert">
          <AlertCircle style={{ width: "15px", height: "15px", flexShrink: 0 }} />{error}
        </div>
      )}

      {/* Category tabs */}
      {!loading && skills.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding: "7px 16px", borderRadius: "9999px", fontSize: "13px", fontWeight: 500,
              cursor: "pointer", border: "1px solid",
              background: activeCat === cat ? "#1e6bff" : "transparent",
              borderColor: activeCat === cat ? "#1e6bff" : "#2a3340",
              color: activeCat === cat ? "#fff" : "#8b949e",
              transition: "all 0.15s",
            }}>
              {cat}
              {cat !== "All" && grouped[cat] && (
                <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.7 }}>
                  ({grouped[cat].length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
          <Loader2 style={{ width: "24px", height: "24px", color: "#1e6bff", animation: "spin 1s linear infinite" }} />
        </div>
      ) : skills.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", borderRadius: "14px", border: "1px dashed #2a3340" }}>
          <Wrench style={{ width: "32px", height: "32px", color: "#4d5966", margin: "0 auto 12px" }} />
          <p style={{ color: "#8b949e", fontSize: "15px", marginBottom: "4px" }}>No skills yet</p>
          <p style={{ color: "#4d5966", fontSize: "13px", marginBottom: "20px" }}>Add your first skill to get started</p>
          <button onClick={openCreate} style={{ padding: "10px 22px", borderRadius: "9px", background: "#1e6bff", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Add Skill
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {visibleGroups.map(([cat, catSkills]) => {
            const color = CAT_COLORS[cat] ?? "#1e6bff";
            return (
              <div key={cat}>
                {/* Category heading */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#e6edf3", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat}</span>
                  <span style={{ fontSize: "12px", color: "#4d5966" }}>({catSkills.length})</span>
                  <div style={{ flex: 1, height: "1px", background: "#2a3340" }} />
                </div>

                {/* Skill cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                  {catSkills.sort((a, b) => a.sortOrder - b.sortOrder).map(s => (
                    <motion.div key={s.id} layout style={{
                      background: "#161b22", border: "1px solid #2a3340", borderRadius: "12px",
                      padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.name}
                        </span>
                        <div style={{ display: "flex", gap: "4px", flexShrink: 0, marginLeft: "8px" }}>
                          <button onClick={() => openEdit(s)} style={{ width: "28px", height: "28px", borderRadius: "7px", background: "none", border: "1px solid #2a3340", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#1c2230"; e.currentTarget.style.color = "#e6edf3"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#8b949e"; }}>
                            <Pencil style={{ width: "13px", height: "13px" }} />
                          </button>
                          <button onClick={() => setDeleteId(s.id)} style={{ width: "28px", height: "28px", borderRadius: "7px", background: "none", border: "1px solid #2a3340", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#8b949e"; e.currentTarget.style.borderColor = "#2a3340"; }}>
                            <Trash2 style={{ width: "13px", height: "13px" }} />
                          </button>
                        </div>
                      </div>

                      {/* Proficiency bar */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", color: "#4d5966" }}>Proficiency</span>
                          <span style={{ fontSize: "11px", fontWeight: 600, color }}>{s.proficiency}%</span>
                        </div>
                        <div style={{ height: "5px", borderRadius: "9999px", background: "#1c2230", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "9999px", background: `linear-gradient(90deg, ${color}, ${color}aa)`, width: `${s.proficiency}%`, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ width: "100%", maxWidth: "460px", background: "#161b22", border: "1px solid #2a3340", borderRadius: "18px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #2a3340" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3" }}>{editing ? "Edit Skill" : "Add New Skill"}</h2>
                <button onClick={() => setModalOpen(false)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#1c2230", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e" }}>
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: "24px" }}>
                {formError && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "9px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "18px" }}>
                    <AlertCircle style={{ width: "14px", height: "14px", flexShrink: 0 }} />{formError}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8b949e", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Skill Name *</label>
                    <input type="text" placeholder="e.g. Azure Monitor" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"}
                      onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                  </div>

                  {/* Category */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8b949e", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category *</label>
                    <div style={{ position: "relative" }}>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
                        onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"}
                        onBlur={e => e.currentTarget.style.borderColor = "#2a3340"}>
                        <option value="">Select a category…</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#4d5966", pointerEvents: "none" }} />
                    </div>
                  </div>

                  {/* Proficiency slider */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Proficiency</label>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: CAT_COLORS[form.category] ?? "#1e6bff" }}>{form.proficiency}%</span>
                    </div>
                    {/* Visual bar */}
                    <div style={{ height: "6px", borderRadius: "9999px", background: "#1c2230", marginBottom: "10px", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "9999px", background: CAT_COLORS[form.category] ?? "#1e6bff", width: `${form.proficiency}%`, transition: "width 0.1s" }} />
                    </div>
                    <input type="range" min={10} max={100} step={5} value={form.proficiency}
                      onChange={e => setForm(f => ({ ...f, proficiency: Number(e.target.value) }))}
                      style={{ width: "100%", accentColor: CAT_COLORS[form.category] ?? "#1e6bff", cursor: "pointer" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                      <span style={{ fontSize: "11px", color: "#4d5966" }}>10%</span>
                      <span style={{ fontSize: "11px", color: "#4d5966" }}>100%</span>
                    </div>
                  </div>

                  {/* Sort order */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8b949e", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sort Order</label>
                    <input type="number" min={0} value={form.sortOrder}
                      onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"}
                      onBlur={e => e.currentTarget.style.borderColor = "#2a3340"} />
                    <p style={{ fontSize: "11px", color: "#4d5966", marginTop: "5px" }}>Lower numbers appear first within each category.</p>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid #2a3340" }}>
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
                  {editing ? "Save Changes" : "Add Skill"}
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3", marginBottom: "8px" }}>Delete Skill</h3>
              <p style={{ fontSize: "14px", color: "#8b949e", marginBottom: "24px", lineHeight: 1.6 }}>
                This skill will be permanently removed and will no longer appear on your portfolio.
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
