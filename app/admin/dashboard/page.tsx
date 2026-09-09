import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FolderGit2, Wrench, MessageSquare, Mail, TrendingUp, ArrowRight, Award } from "lucide-react";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let stats = { projects: 0, skills: 0, certs: 0, unread: 0, total: 0 };
  let recentMessages: Array<{ id: string; name: string; subject: string; createdAt: Date; read: boolean }> = [];

  try {
    const [projectCount, skillCount, certCount, unreadCount, totalMessages, messages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.certification.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    stats = { projects: projectCount, skills: skillCount, certs: certCount, unread: unreadCount, total: totalMessages };
    recentMessages = messages;
  } catch { /* DB unavailable */ }

  const cards = [
    { label: "Projects",        value: stats.projects, Icon: FolderGit2,   color: "#1e6bff", href: "/admin/projects",       sub: "Portfolio projects" },
    { label: "Skills",          value: stats.skills,   Icon: Wrench,        color: "#10b981", href: "/admin/skills",         sub: "Technical skills" },
    { label: "Certifications",  value: stats.certs,    Icon: Award,         color: "#f59e0b", href: "/admin/certifications", sub: "Credentials" },
    { label: "Unread Messages", value: stats.unread,   Icon: Mail,          color: stats.unread > 0 ? "#ef4444" : "#6366f1", href: "/admin/messages", sub: "Need attention" },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <TrendingUp style={{ width: "16px", height: "16px", color: "#1e6bff" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e6bff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Overview</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.02em", marginBottom: "6px" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "#8b949e", lineHeight: 1.6 }}>
          Welcome back,{" "}
          <span style={{ color: "#e6edf3", fontWeight: 500 }}>
            {session.user?.email?.split("@")[0]}
          </span>
          . Here&apos;s your portfolio overview.
        </p>
      </div>

      {/* Stat cards — no hover handlers (server component) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "32px",
      }}>
        {cards.map(({ label, value, Icon, color, href, sub }) => (
          <a key={label} href={href} style={{
            background: "#161b22",
            border: "1px solid #2a3340",
            borderRadius: "14px",
            padding: "22px",
            textDecoration: "none",
            display: "block",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "11px",
                background: `${color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon style={{ width: "19px", height: "19px", color }} />
              </div>
              <ArrowRight style={{ width: "14px", height: "14px", color: "#4d5966" }} />
            </div>
            <div style={{ fontSize: "34px", fontWeight: 800, color, lineHeight: 1, marginBottom: "6px" }}>{value}</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e6edf3", marginBottom: "3px" }}>{label}</div>
            <div style={{ fontSize: "12px", color: "#4d5966" }}>{sub}</div>
          </a>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Add New Project",       href: "/admin/projects",       color: "#1e6bff", Icon: FolderGit2 },
          { label: "Add New Skill",         href: "/admin/skills",         color: "#10b981", Icon: Wrench },
          { label: "Add Certification",     href: "/admin/certifications", color: "#f59e0b", Icon: Award },
        ].map(({ label, href, color, Icon }) => (
          <a key={label} href={href} style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "18px 22px", borderRadius: "12px",
            background: `${color}0d`, border: `1px solid ${color}28`,
            textDecoration: "none",
          }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon style={{ width: "17px", height: "17px", color }} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#e6edf3" }}>{label}</span>
            <ArrowRight style={{ width: "14px", height: "14px", color: "#4d5966", marginLeft: "auto" }} />
          </a>
        ))}
      </div>

      {/* Recent messages */}
      <div style={{ background: "#161b22", border: "1px solid #2a3340", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px", borderBottom: "1px solid #2a3340",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MessageSquare style={{ width: "15px", height: "15px", color: "#8b949e" }} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#e6edf3" }}>Recent Messages</span>
            {stats.unread > 0 && (
              <span style={{
                fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "9999px",
                background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)",
              }}>
                {stats.unread} unread
              </span>
            )}
          </div>
          <a href="/admin/messages" style={{ fontSize: "12px", color: "#58a6ff", textDecoration: "none", fontWeight: 500 }}>
            View all →
          </a>
        </div>

        {recentMessages.length === 0 ? (
          <div style={{ padding: "56px 22px", textAlign: "center", color: "#4d5966", fontSize: "14px" }}>
            No messages yet. They&apos;ll appear once someone contacts you.
          </div>
        ) : (
          <div>
            {recentMessages.map((msg, i) => (
              <a key={msg.id} href="/admin/messages" style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 22px",
                borderBottom: i < recentMessages.length - 1 ? "1px solid #1c2230" : "none",
                background: !msg.read ? "rgba(30,107,255,0.03)" : "transparent",
                textDecoration: "none",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                  background: !msg.read ? "rgba(30,107,255,0.15)" : "#1c2230",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 700,
                  color: !msg.read ? "#58a6ff" : "#4d5966",
                }}>
                  {msg.name[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1e6bff", flexShrink: 0 }} />
                    )}
                  </div>
                  <span style={{ fontSize: "12px", color: "#8b949e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {msg.subject}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#4d5966", flexShrink: 0 }}>
                  {formatDate(msg.createdAt)}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Responsive grid fix for smaller screens */}
      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .actions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
