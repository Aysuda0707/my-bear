import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * NOTE: The link preview (title, description, Open Graph / Twitter tags) is
 * intentionally neutral and generic. The birthday surprise must stay secret
 * when the link is shared, so nothing here reveals that this is a birthday app.
 */
export const metadata: Metadata = {
  title: "My Bear 🧸",
  description: "A cozy little corner with a fluffy teddy bear.",
  applicationName: "My Bear",
  keywords: ["teddy bear", "cute", "cozy"],
  authors: [{ name: "My Bear" }],
  openGraph: {
    title: "My Bear 🧸",
    description: "A cozy little corner with a fluffy teddy bear.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Bear 🧸",
    description: "A cozy little corner with a fluffy teddy bear.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffd6e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
