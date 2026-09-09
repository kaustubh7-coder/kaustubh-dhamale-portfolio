"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Mail, MailOpen, X, AlertCircle, Loader2, MessageSquare, Reply } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function AdminMessagesClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error();
      setMessages(await res.json());
    } catch { setError("Failed to load messages."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read }) });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m));
      if (selected?.id === id) setSelected(s => s ? { ...s, read } : null);
    } catch { setError("Failed to update message."); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/messages/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
      load();
    } catch { setError("Delete failed."); }
    finally { setDeleting(false); }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) await markRead(msg.id, true);
  };

  const filtered = filter === "unread" ? messages.filter(m => !m.read) : messages;
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <MessageSquare style={{ width: "16px", height: "16px", color: "#1e6bff" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e6bff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Inbox</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.02em", marginBottom: "4px" }}>Messages</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p style={{ fontSize: "14px", color: "#8b949e" }}>{messages.length} message{messages.length !== 1 ? "s" : ""} total</p>
            {unreadCount > 0 && (
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "9999px", background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(["all", "unread"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", border: "1px solid",
              background: filter === f ? "#1e6bff" : "#1c2230",
              borderColor: filter === f ? "#1e6bff" : "#2a3340",
              color: filter === f ? "#fff" : "#8b949e",
              transition: "all 0.15s",
            }}>
              {f === "all" ? `All (${messages.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
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
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", borderRadius: "14px", border: "1px dashed #2a3340" }}>
          <MessageSquare style={{ width: "32px", height: "32px", color: "#4d5966", margin: "0 auto 12px" }} />
          <p style={{ color: "#8b949e", fontSize: "15px" }}>No {filter === "unread" ? "unread " : ""}messages</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(msg => (
            <motion.div key={msg.id} layout
              onClick={() => openMessage(msg)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "16px 20px", borderRadius: "12px", cursor: "pointer",
                background: !msg.read ? "rgba(30,107,255,0.05)" : "#161b22",
                border: `1px solid ${!msg.read ? "rgba(30,107,255,0.2)" : "#2a3340"}`,
                transition: "border-color 0.15s",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                background: !msg.read ? "rgba(30,107,255,0.15)" : "#1c2230",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700,
                color: !msg.read ? "#58a6ff" : "#4d5966",
              }}>
                {msg.name[0]?.toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "14px", fontWeight: !msg.read ? 700 : 500, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.name}
                  </span>
                  {!msg.read && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1e6bff", flexShrink: 0 }} />}
                  <span style={{ fontSize: "11px", color: "#4d5966", marginLeft: "auto", flexShrink: 0 }}>
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#8b949e", fontWeight: !msg.read ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                  {msg.subject}
                </p>
                <p style={{ fontSize: "12px", color: "#4d5966", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.message}
                </p>
              </div>

              <button onClick={e => { e.stopPropagation(); setDeleteId(msg.id); }}
                style={{ width: "32px", height: "32px", borderRadius: "8px", background: "none", border: "1px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#4d5966", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#4d5966"; e.currentTarget.style.borderColor = "transparent"; }}>
                <Trash2 style={{ width: "14px", height: "14px" }} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Message detail modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setSelected(null)} role="dialog" aria-modal="true">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ width: "100%", maxWidth: "540px", background: "#161b22", border: "1px solid #2a3340", borderRadius: "18px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #2a3340" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "16px" }}>
                  {selected.subject}
                </h2>
                <button onClick={() => setSelected(null)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#1c2230", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e", flexShrink: 0 }}>
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </div>

              {/* Sender */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 24px", borderBottom: "1px solid #1c2230" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(30,107,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#58a6ff", flexShrink: 0 }}>
                  {selected.name[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#e6edf3", marginBottom: "3px" }}>{selected.name}</p>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: "13px", color: "#58a6ff", textDecoration: "none" }}>{selected.email}</a>
                </div>
                <span style={{ fontSize: "12px", color: "#4d5966", flexShrink: 0 }}>
                  {formatDate(selected.createdAt)}
                </span>
              </div>

              {/* Message body */}
              <div style={{ padding: "24px", minHeight: "120px" }}>
                <p style={{ fontSize: "14px", color: "#8b949e", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {selected.message}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #2a3340", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => markRead(selected.id, !selected.read)} style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "9px 16px", borderRadius: "9px", background: "#1c2230",
                  border: "1px solid #2a3340", color: "#8b949e", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                }}>
                  {selected.read ? <Mail style={{ width: "14px", height: "14px" }} /> : <MailOpen style={{ width: "14px", height: "14px" }} />}
                  Mark as {selected.read ? "unread" : "read"}
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "9px", background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.25)", color: "#58a6ff", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                    <Reply style={{ width: "14px", height: "14px" }} /> Reply
                  </a>
                  <button onClick={() => { setDeleteId(selected.id); setSelected(null); }} style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "9px 16px", borderRadius: "9px", background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  }}>
                    <Trash2 style={{ width: "14px", height: "14px" }} /> Delete
                  </button>
                </div>
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e6edf3", marginBottom: "8px" }}>Delete Message</h3>
              <p style={{ fontSize: "14px", color: "#8b949e", marginBottom: "24px", lineHeight: 1.6 }}>
                This message will be permanently deleted and cannot be recovered.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#1c2230", border: "1px solid #2a3340", color: "#8b949e", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "9px",
                  background: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none",
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
