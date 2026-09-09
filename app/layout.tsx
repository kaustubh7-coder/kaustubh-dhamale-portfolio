import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Kaustubh Dhamale | Azure Cloud Support Engineer",
    template: "%s | Kaustubh Dhamale",
  },
  description:
    "Portfolio of Kaustubh Dhamale — Azure Cloud Support Engineer specialising in cloud infrastructure, monitoring, incident management, Terraform and Linux operations.",
  authors: [{ name: "Kaustubh Dhamale" }],
  openGraph: {
    type: "website",
    siteName: "Kaustubh Dhamale",
    title: "Kaustubh Dhamale | Azure Cloud Support Engineer",
    description: "Azure Cloud Support Engineer — 2+ years monitoring and automating Azure infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaustubh Dhamale | Azure Cloud Support Engineer",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
