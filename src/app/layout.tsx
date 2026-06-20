import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  applicationName: "Q‑Art",
  title: { default: "Q‑Art", template: "%s · Q‑Art" },
  description:
    "Bring the question you can't resolve. Leave with a better question — and the answer that comes with it.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Q‑Art", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1011" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
