import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Bear 🧸 | A Little Birthday Surprise",
  description:
    "A cozy, animated birthday surprise with a fluffy teddy bear, a gift to open, a birthday cake and a sweet message.",
  applicationName: "My Bear",
  keywords: ["birthday", "teddy bear", "surprise", "My Bear", "doğum günü"],
  authors: [{ name: "My Bear" }],
  openGraph: {
    title: "My Bear 🧸 | A Little Birthday Surprise",
    description:
      "Open the gift and discover a little birthday surprise from a fluffy teddy bear.",
    type: "website",
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
