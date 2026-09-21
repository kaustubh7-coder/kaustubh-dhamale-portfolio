import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

// ── Viewport (separate export required in Next.js 13+) ──────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,       // allow user zoom (accessibility)
  userScalable: true,
  viewportFit: "cover",  // iOS notch / safe-area support
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0d1117" },
  ],
};

// ── Page metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Kaustubh Dhamale | Azure Cloud Support Engineer",
    template: "%s | Kaustubh Dhamale",
  },
  description:
    "Portfolio of Kaustubh Dhamale — Azure Cloud Support Engineer specialising in cloud infrastructure, monitoring, incident management, Terraform and Linux operations.",
  authors: [{ name: "Kaustubh Dhamale" }],
  keywords: [
    "Azure", "Cloud Engineer", "Azure Monitor", "Terraform", "DevOps",
    "AZ-104", "Cloud Support", "Kaustubh Dhamale",
  ],
  // iOS web-app meta
  appleWebApp: {
    capable: true,
    title: "Kaustubh Dhamale",
    statusBarStyle: "default",
  },
  // Open Graph
  openGraph: {
    type: "website",
    siteName: "Kaustubh Dhamale",
    title: "Kaustubh Dhamale | Azure Cloud Support Engineer",
    description:
      "Azure Cloud Support Engineer — 2+ years monitoring and automating Azure infrastructure.",
  },
  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Kaustubh Dhamale | Azure Cloud Support Engineer",
  },
  robots: { index: true, follow: true },
};

// ── Root layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/*
          Inline theme script — runs synchronously before first paint so the
          correct data-theme is set before React hydrates. This prevents both
          the flash-of-wrong-theme and the React hydration mismatch.
          suppressHydrationWarning on <html> handles the attribute diff.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
