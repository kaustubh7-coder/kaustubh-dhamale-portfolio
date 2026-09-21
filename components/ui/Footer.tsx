import { Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Certifications", "Contact"];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#0f172a", padding: "56px 0 0" }}>
      <style>{`
        #footer-grid {
          display: grid; gap: 40px;
          grid-template-columns: 2fr 1.2fr 2fr;
          margin-bottom: 40px;
        }
        .f-link { font-size: 14px; color: #64748b; text-decoration: none; transition: color 0.15s; display: block; padding: 4px 0; }
        .f-link:hover { color: #60a5fa; }
        .f-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #64748b; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); text-decoration: none; transition: transform 0.15s; }
        .f-icon:hover { transform: translateY(-2px); }
        @media (max-width: 800px) {
          #footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          #footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>
        <div id="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0, background: "linear-gradient(135deg, #1e6bff, #1252cc)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: 700 }}>KD</div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9" }}>Kaustubh Dhamale</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Azure Cloud Support Engineer</div>
              </div>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#475569" }}>
              Building and maintaining reliable Azure cloud infrastructure.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "16px" }}>Navigation</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {NAV_LINKS.map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="f-link">{item}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "16px" }}>Contact</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="mailto:kaustubhdhamale.work@gmail.com" className="f-link"
                style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#64748b", textDecoration: "none" }}>
                <Mail style={{ width: "15px", height: "15px", color: "#1e6bff", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ wordBreak: "break-all", fontSize: "13px" }}>kaustubhdhamale.work@gmail.com</span>
              </a>
              <a href="tel:+919370614621" className="f-link"
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b", textDecoration: "none" }}>
                <Phone style={{ width: "15px", height: "15px", color: "#1e6bff", flexShrink: 0 }} />
                <span style={{ fontSize: "13px" }}>+91-9370614621</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#64748b" }}>
                <MapPin style={{ width: "15px", height: "15px", color: "#1e6bff", flexShrink: 0 }} />
                Pune, Maharashtra, India
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <a href="https://github.com/kaustubh7-coder" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="f-icon">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/kaustubh-dhamale-95836725a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="f-icon">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}>
          <p style={{ fontSize: "13px", color: "#334155" }}>© {year} Kaustubh Dhamale. All rights reserved.</p>
          <p style={{ fontSize: "13px", color: "#334155" }}>Next.js · TypeScript · Prisma · Neon</p>
        </div>
      </div>
    </footer>
  );
}
