import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Sayfold — Voice-First Knowledge Vault for Readers & Listeners",
  description:
    "Capture what you read and hear just by speaking. Sayfold transcribes your voice in seconds, organizes by book and chapter, and builds your permanent personal knowledge vault.",
  keywords: [
    "reading companion",
    "voice notes",
    "knowledge management",
    "book quotes",
    "vocabulary vault",
    "PWA",
    "Sayfold",
  ],
  authors: [{ name: "Sayfold Team" }],
  openGraph: {
    title: "Sayfold — Voice-First Knowledge Vault",
    description:
      "Capture what you read and hear just by speaking. Transcribed instantly, organized by book & chapter.",
    url: "https://sayfold.app",
    siteName: "Sayfold",
    images: [
      {
        url: "/brand/sayfold-logo.png",
        width: 1200,
        height: 630,
        alt: "Sayfold — Voice-First Knowledge Vault",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayfold — Voice-First Knowledge Vault",
    description: "Capture wisdom while you read. Speak naturally into your personal vault.",
    images: ["/brand/sayfold-logo.png"],
  },
  icons: {
    icon: "/brand/sayfold-icon.svg",
    apple: "/brand/sayfold-icon.png",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sayfold",
    operatingSystem: "Web, iOS Safari, Android Chrome, Windows, macOS",
    applicationCategory: "ProductivityApplication",
    description:
      "Voice-first reading companion that captures, transcribes, and categorizes your reading wisdom into a personal knowledge vault.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#1F1E1B] flex flex-col font-sans selection:bg-[#E8643C]/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

