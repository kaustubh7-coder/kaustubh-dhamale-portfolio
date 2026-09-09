import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FolderGit2, Wrench, MessageSquare, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let stats = { projects: 0, skills: 0, unread: 0, total: 0 };
  let recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: Date;
    read: boolean;
  }> = [];

  try {
    const [projectCount, skillCount, unreadCount, totalMessages, messages] =
      await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.contactMessage.count(),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);
    stats = {
      projects: projectCount,
      skills: skillCount,
      unread: unreadCount,
      total: totalMessages,
    };
    recentMessages = messages;
  } catch {
    // DB not available
  }

  const cards = [
    {
      label: "Total Projects",
      value: stats.projects,
      icon: FolderGit2,
      color: "#0078d4",
      href: "/admin/projects",
    },
    {
      label: "Total Skills",
      value: stats.skills,
      icon: Wrench,
      color: "#2899f5",
      href: "/admin/skills",
    },
    {
      label: "Unread Messages",
      value: stats.unread,
      icon: Mail,
      color: stats.unread > 0 ? "#f59e0b" : "#00b4d8",
      href: "/admin/messages",
    },
    {
      label: "Total Messages",
      value: stats.total,
      icon: MessageSquare,
      color: "#00b4d8",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="pt-16 md:pt-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Welcome back. Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <a
            key={label}
            href={href}
            className="rounded-xl border p-5 hover:border-[var(--border)] transition-all group"
            style={{
              borderColor: "var(--border-subtle)",
              background: "var(--surface)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div
              className="text-2xl font-bold mb-0.5"
              style={{ color }}
            >
              {value}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{label}</p>
          </a>
        ))}
      </div>

      {/* Recent messages */}
      <div
        className="rounded-xl border"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--surface)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <h2 className="font-semibold text-[var(--text-primary)] text-sm">
            Recent Messages
          </h2>
          <a
            href="/admin/messages"
            className="text-xs text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
          >
            View all
          </a>
        </div>

        {recentMessages.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
            No messages yet.
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {recentMessages.map((msg) => (
              <li key={msg.id} className="px-5 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {msg.subject}
                  </p>
                </div>
                <span className="text-xs text-[var(--text-muted)] shrink-0">
                  {formatDate(msg.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
