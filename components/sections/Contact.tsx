"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2)    e.name    = "At least 2 characters required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.subject.trim().length < 5)  e.subject = "At least 5 characters required.";
    if (form.message.trim().length < 20) e.message = "At least 20 characters required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res  = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error ?? "Something went wrong."); setStatus("error"); }
      else { setStatus("success"); setForm({ name: "", email: "", subject: "", message: "" }); }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "var(--heading)",
    background: "var(--bg-soft)",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#e2e8f0"}`,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  });

  return (
    <motion.section
      id="contact"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ background: "var(--bg-soft)", padding: "96px 0" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 40px" }}>

        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1e6bff", marginBottom: "12px" }}>
            Contact
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--heading)", lineHeight: 1.1, marginBottom: "16px" }}>
            Let&apos;s Talk
          </h2>
          <div style={{ width: "48px", height: "3px", borderRadius: "9999px", background: "linear-gradient(90deg, #1e6bff, #60a5fa)" }} />
        </div>

        <div id="contact-grid" style={{ display: "grid", gap: "28px", alignItems: "start" }}>

          {/* Left — info */}
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px",
            padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", gap: "28px",
          }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--heading)", marginBottom: "20px" }}>Get In Touch</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {[
                  { icon: Mail,  label: "Email",    value: "kaustubhdhamale.work@gmail.com", href: "mailto:kaustubhdhamale.work@gmail.com" },
                  { icon: Phone, label: "Phone",    value: "+91-9370614621", href: "tel:+919370614621" },
                  { icon: MapPin,label: "Location", value: "Pune, Maharashtra, India" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "12px",
                      background: "#eff4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon style={{ width: "17px", height: "17px", color: "#1e6bff" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {label}
                      </div>
                      {href ? (
                        <a href={href} style={{ fontSize: "14px", color: "var(--body)", textDecoration: "none" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#1e6bff")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                          {value}
                        </a>
                      ) : (
                        <span style={{ fontSize: "14px", color: "var(--body)" }}>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
                Find Me On
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <a href="https://github.com/kaustubh7-coder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                    borderRadius: "10px", fontSize: "13px", fontWeight: 600, color: "var(--body)",
                    background: "var(--bg-soft)", border: "1px solid var(--card-border)", textDecoration: "none",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                  <GithubIcon className="w-4 h-4" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                    borderRadius: "10px", fontSize: "13px", fontWeight: 600, color: "var(--body)",
                    background: "var(--bg-soft)", border: "1px solid var(--card-border)", textDecoration: "none",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                  <LinkedinIcon className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px",
            padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center", gap: "16px" }}
              >
                <CheckCircle style={{ width: "56px", height: "56px", color: "#059669" }} />
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--heading)" }}>Message Sent!</h3>
                <p style={{ color: "var(--body)" }}>Thanks for reaching out. I&apos;ll get back to you soon.</p>
                <button onClick={() => setStatus("idle")}
                  style={{
                    marginTop: "8px", padding: "10px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                    background: "var(--bg-soft)", color: "var(--body)", border: "1px solid var(--card-border)", cursor: "pointer",
                  }}>
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--heading)", marginBottom: "24px" }}>Send a Message</h3>

                {status === "error" && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px",
                    borderRadius: "10px", marginBottom: "20px", fontSize: "13px",
                    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                  }} role="alert">
                    <AlertCircle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                    {errMsg}
                  </div>
                )}

                <div id="form-row" style={{ display: "grid", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label htmlFor="name" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--body)", marginBottom: "6px" }}>
                      Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input id="name" type="text" placeholder="Your name" autoComplete="name"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (errors.name) setErrors(ev => { const n = {...ev}; delete n.name; return n; }); }}
                      style={inputStyle("name")}
                      onFocus={e => (e.currentTarget.style.borderColor = "#1e6bff")}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.name ? "#ef4444" : "#e2e8f0")}
                    />
                    {errors.name && <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--body)", marginBottom: "6px" }}>
                      Email <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input id="email" type="email" placeholder="you@email.com" autoComplete="email"
                      value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email) setErrors(ev => { const n = {...ev}; delete n.email; return n; }); }}
                      style={inputStyle("email")}
                      onFocus={e => (e.currentTarget.style.borderColor = "#1e6bff")}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0")}
                    />
                    {errors.email && <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>{errors.email}</p>}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label htmlFor="subject" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--body)", marginBottom: "6px" }}>
                    Subject <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input id="subject" type="text" placeholder="What's this about?"
                    value={form.subject}
                    onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); if (errors.subject) setErrors(ev => { const n = {...ev}; delete n.subject; return n; }); }}
                    style={inputStyle("subject")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#1e6bff")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.subject ? "#ef4444" : "#e2e8f0")}
                  />
                  {errors.subject && <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>{errors.subject}</p>}
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label htmlFor="message" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--body)", marginBottom: "6px" }}>
                    Message <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea id="message" rows={5} placeholder="Tell me about your project or opportunity..."
                    value={form.message}
                    onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(ev => { const n = {...ev}; delete n.message; return n; }); }}
                    style={{ ...inputStyle("message"), resize: "none" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#1e6bff")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.message ? "#ef4444" : "#e2e8f0")}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    {errors.message ? <p style={{ fontSize: "12px", color: "#ef4444" }}>{errors.message}</p> : <span />}
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>{form.message.length}/5000</span>
                  </div>
                </div>

                <button type="submit" disabled={status === "loading"}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "13px 28px", borderRadius: "12px", fontSize: "15px", fontWeight: 600,
                    color: "var(--card-bg)", background: "linear-gradient(135deg, #1e6bff, #1252cc)",
                    border: "none", cursor: status === "loading" ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px rgba(30,107,255,0.3)",
                    opacity: status === "loading" ? 0.7 : 1,
                    transition: "transform 0.15s, opacity 0.15s",
                  }}
                  onMouseEnter={e => { if (status !== "loading") (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  {status === "loading" ? (
                    <><svg style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" /></svg> Sending...</>
                  ) : (
                    <><Send style={{ width: "16px", height: "16px" }} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        #contact-grid { grid-template-columns: 2fr 3fr; }
        #form-row { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) { #contact-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { #form-row { grid-template-columns: 1fr; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.section>
  );
}
