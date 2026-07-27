import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://steady-site.vercel.app"),
  title: "Steady: The Warm Voice Companion for Looping Thoughts & OCD",
  description:
    "Your head is loud. Let's talk it quiet. Steady is a friendly voice companion for looping thoughts, Pure O, checking, and rumination — talk it out, practice letting the loop pass, and get your evenings back. Free to start.",
  openGraph: {
    title: "Steady: The Warm Voice Companion for Looping Thoughts & OCD",
    description:
      "Talk it out, out loud, with a warm voice on your side. Built on therapist-trusted exposure practice. Free to start, no card.",
    images: ["/photos/hero-woman-relief.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        {/* Site-wide, not just the homepage: someone landing on /blog must be
            able to consent (or refuse) before anything is measured. */}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
