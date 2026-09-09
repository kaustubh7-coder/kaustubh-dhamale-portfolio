"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Mail, MailOpen, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function AdminMessagesClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error();
      setMessages(await res.json());
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const markRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read } : m));
      if (selected?.id === id) setSelected((s) => s ? { ...s, read } : null);
    } catch {
      setError("Failed to update message.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/messages/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
      fetch_();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await markRead(msg.id, true);
    }
  };

  const filtered = filter === "unread" ? messages.filter((m) => !m.read) : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Messages</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Contact form submissions.
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent-light)] text-xs font-medium border border-[var(--accent)]/20">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
              }`}
            >
              {f === "all" ? `All (${messages.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-sm">No {filter === "unread" ? "unread " : ""}messages.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              onClick={() => openMessage(msg)}
              className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all hover:border-[var(--border)] ${
                !msg.read ? "border-[var(--accent)]/30" : "border-[var(--border-subtle)]"
              }`}
              style={{ background: "var(--surface)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: msg.read ? "var(--surface-2)" : "rgba(0,120,212,0.1)" }}
              >
                {msg.read
                  ? <MailOpen className="w-4 h-4 text-[var(--text-muted)]" />
                  : <Mail className="w-4 h-4 text-[var(--accent)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-medium truncate ${msg.read ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}`}>
                    {msg.name}
                  </span>
                  {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />}
                  <span className="text-xs text-[var(--text-muted)] ml-auto shrink-0">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] truncate mb-0.5">{msg.subject}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{msg.message}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-all shrink-0"
                aria-label="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            role="dialog" aria-modal="true"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <h2 className="font-semibold text-[var(--text-primary)] truncate pr-4">{selected.subject}</h2>
                <button onClick={() => setSelected(null)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all shrink-0" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[var(--accent)]">{selected.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-xs text-[var(--accent-light)] hover:underline truncate block">
                      {selected.email}
                    </a>
                  </div>
                  <span className="ml-auto text-xs text-[var(--text-muted)] shrink-0">{formatDate(selected.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex justify-between items-center px-6 py-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markRead(selected.id, !selected.read)}
                >
                  {selected.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  Mark as {selected.read ? "unread" : "read"}
                </Button>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--border)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply
                  </a>
                  <Button variant="danger" size="sm" onClick={() => setDeleteId(selected.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
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
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Delete Message</h3>
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
