"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Shield, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #0a0f1a 50%, #0d1117 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(rgba(30,107,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Glow orb */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse, rgba(30,107,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        filter: "blur(40px)",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}
      >
        {/* Card */}
        <div style={{
          background: "linear-gradient(145deg, #161b22, #1c2230)",
          border: "1px solid #2a3340",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: "linear-gradient(135deg, #1e6bff, #1252cc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(30,107,255,0.4)",
            }}>
              <Shield style={{ width: "20px", height: "20px", color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#e6edf3", lineHeight: 1.2 }}>
                Admin Panel
              </div>
              <div style={{ fontSize: "12px", color: "#4d5966", marginTop: "2px" }}>
                Portfolio Management
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#e6edf3", marginBottom: "6px", letterSpacing: "-0.02em" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "28px" }}>
            Sign in to manage your portfolio content.
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "12px 14px", borderRadius: "10px", marginBottom: "20px",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: "13px",
              }}
              role="alert"
            >
              <AlertCircle style={{ width: "15px", height: "15px", flexShrink: 0 }} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8b949e", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="kaustubhdhamale.work@gmail.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                required
                style={{
                  width: "100%", background: "#0d1117", border: "1px solid #2a3340",
                  borderRadius: "10px", padding: "12px 16px",
                  fontSize: "14px", color: "#e6edf3", outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"}
                onBlur={e => e.currentTarget.style.borderColor = "#2a3340"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8b949e", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%", background: "#0d1117", border: "1px solid #2a3340",
                    borderRadius: "10px", padding: "12px 48px 12px 16px",
                    fontSize: "14px", color: "#e6edf3", outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#1e6bff"}
                  onBlur={e => e.currentTarget.style.borderColor = "#2a3340"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#4d5966", padding: "4px",
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "14px", borderRadius: "10px",
                background: loading ? "#1252cc" : "linear-gradient(135deg, #1e6bff, #1252cc)",
                color: "#fff", fontSize: "15px", fontWeight: 600, border: "none",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1,
                boxShadow: "0 8px 24px rgba(30,107,255,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,107,255,0.45)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,107,255,0.35)"; }}
            >
              {loading ? <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} /> : null}
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <ArrowRight style={{ width: "16px", height: "16px" }} />}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <a href="/" style={{ fontSize: "13px", color: "#4d5966", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#8b949e"}
            onMouseLeave={e => e.currentTarget.style.color = "#4d5966"}>
            ← Back to portfolio
          </a>
        </div>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
