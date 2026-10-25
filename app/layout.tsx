import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reaper500.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Reaper500 | Kibang Virtue — Developer & Tech Enthusiast",
    template: "%s | Reaper500",
  },
  description:
    "Explore the portfolio of Kibang Virtue, known as Reaper500. Discover web development, mobile development, systems programming, AI exploration, open-source projects, and technology reviews.",
  keywords: [
    "Reaper500",
    "Kibang Virtue",
    "developer portfolio",
    "web development",
    "mobile development",
    "Rust",
    "C++",
    "Laravel",
    "AI",
    "tech reviews",
    "Nigeria developer",
  ],
  authors: [{ name: "Kibang Virtue", url: "https://github.com/Reaper500" }],
  creator: "Reaper500",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Reaper500 | Kibang Virtue — Developer & Tech Enthusiast",
    description:
      "Web development, mobile development, systems programming, AI exploration, and technology reviews by Kibang Virtue (Reaper500).",
    siteName: "REAPER500 // DIGITAL FRONTIER",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "REAPER500 — I build for the digital frontier.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reaper500 | Kibang Virtue — Developer & Tech Enthusiast",
    description:
      "Web, mobile, systems programming, AI exploration, and technology reviews by Kibang Virtue (Reaper500).",
    images: ["/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <noscript>
          {/* Without JS the reveal animations never run — keep content visible. */}
          <style>{`.reveal-hidden{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent-lime focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-base-deep"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
