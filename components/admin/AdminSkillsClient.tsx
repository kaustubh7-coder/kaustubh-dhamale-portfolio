"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  proficiency: number;
  sortOrder: number;
}

type FormState = Omit<Skill, "id">;

const emptyForm: FormState = {
  name: "",
  category: "",
  icon: "",
  proficiency: 80,
  sortOrder: 0,
};

const CATEGORIES = [
  "Cloud",
  "Monitoring",
  "Operating Systems",
  "Networking",
  "Automation & IaC",
  "Containers & Tools",
  "IT Operations",
];

export function AdminSkillsClient() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      if (!res.ok) throw new Error();
      setSkills(await res.json());
    } catch {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] ?? [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, icon: s.icon ?? "", proficiency: s.proficiency, sortOrder: s.sortOrder });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      setFormError("Name and category are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, icon: form.icon || null };
      const res = editing
        ? await fetch(`/api/admin/skills/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Save failed.");
      } else {
        setModalOpen(false);
        fetch_();
      }
    } catch {
      setFormError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/skills/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetch_();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Skills</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your technical skills.</p>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4" />Add Skill</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" /></div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-sm mb-3">No skills yet.</p>
          <Button onClick={openCreate} variant="secondary" size="sm"><Plus className="w-4 h-4" />Add your first skill</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catSkills.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    className="flex items-center justify-between rounded-xl border p-4"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate mb-1">{s.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--surface-2)]">
                          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${s.proficiency}%` }} />
                        </div>
                        <span className="text-xs text-[var(--text-muted)] shrink-0">{s.proficiency}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all" aria-label={`Edit ${s.name}`}>
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-all" aria-label={`Delete ${s.name}`}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-[var(--text-primary)]">{editing ? "Edit Skill" : "New Skill"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all" aria-label="Close"><X className="w-5 h-5" /></button>
              </div>
              {formError && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
                  <AlertCircle className="w-4 h-4" />{formError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Name *</label>
                  <input type="text" placeholder="e.g. Azure Monitor" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Proficiency: {form.proficiency}%
                  </label>
                  <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm((f) => ({ ...f, proficiency: Number(e.target.value) }))}
                    className="w-full accent-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button size="sm" loading={saving} onClick={handleSave}>{editing ? "Save Changes" : "Add Skill"}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Delete Skill</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-5">This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
