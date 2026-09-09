"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";

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

type FormState = Partial<Omit<Project, "id" | "technologies">> & {
  technologies: string;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  image: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  technologies: "",
  sortOrder: 0,
};

export function AdminProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error();
      setProjects(await res.json());
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription ?? "",
      image: p.image ?? "",
      githubUrl: p.githubUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      featured: p.featured,
      technologies: p.technologies.join(", "),
      sortOrder: p.sortOrder,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title?.trim() || !form.description?.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        description: form.description,
        longDescription: form.longDescription || null,
        image: form.image || null,
        githubUrl: form.githubUrl || null,
        liveUrl: form.liveUrl || null,
        featured: !!form.featured,
        technologies: form.technologies
          ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        sortOrder: form.sortOrder ?? 0,
      };

      const res = editing
        ? await fetch(`/api/admin/projects/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

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
      await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your portfolio projects.
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-sm mb-3">No projects yet.</p>
          <Button onClick={openCreate} variant="secondary" size="sm">
            <Plus className="w-4 h-4" />
            Add your first project
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              layout
              className="flex items-start gap-4 rounded-xl border p-4"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {p.title}
                  </span>
                  {p.featured && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent-light)] border border-[var(--accent)]/20 font-medium shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mb-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.technologies.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                    >
                      {t}
                    </span>
                  ))}
                  {p.technologies.length > 5 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-[var(--text-muted)]">
                      +{p.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all"
                  aria-label={`Edit ${p.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-all"
                  aria-label={`Delete ${p.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-[var(--surface)] z-10" style={{ borderColor: "var(--border-subtle)" }}>
                <h2 className="font-semibold text-[var(--text-primary)]">
                  {editing ? "Edit Project" : "New Project"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
                    <AlertCircle className="w-4 h-4" />{formError}
                  </div>
                )}
                {[
                  { label: "Title *", field: "title", placeholder: "Project title" },
                  { label: "Slug", field: "slug", placeholder: "auto-generated if empty" },
                  { label: "Image URL", field: "image", placeholder: "https://..." },
                  { label: "GitHub URL", field: "githubUrl", placeholder: "https://github.com/..." },
                  { label: "Live URL", field: "liveUrl", placeholder: "https://..." },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={(form as Record<string, unknown>)[field] as string ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Short description"
                    value={form.description ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Long Description</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed description (optional)"
                    value={form.longDescription ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Azure, Terraform, Linux"
                    value={form.technologies ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Sort Order</label>
                    <input
                      type="number"
                      value={form.sortOrder ?? 0}
                      onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!form.featured}
                        onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                        className="w-4 h-4 rounded accent-[var(--accent)]"
                      />
                      <span className="text-sm text-[var(--text-secondary)]">Featured</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 flex justify-end gap-2 px-6 py-4 border-t bg-[var(--surface)]" style={{ borderColor: "var(--border-subtle)" }}>
                <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button size="sm" loading={saving} onClick={handleSave}>
                  {editing ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Delete Project</h3>
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
