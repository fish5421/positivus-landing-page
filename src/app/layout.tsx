import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import IntersectionObserver from "@/components/IntersectionObserver";
import { PostHogProvider } from "../components/PostHogProvider";
import { ScrollTracker } from "@/lib/scrollTracker";
import { SectionTracker } from "@/lib/sectionTracker";
import { ButtonTracker } from "@/lib/buttonTracker";
import { CTATracker } from "@/lib/ctaTracker";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Precision Data - Real Estate Valuation Data Enrichment for Direct Mail",
  description: "Transform your direct mail campaigns with premium real estate valuation data enrichment for precise targeting and higher ROI.",
  keywords: "real estate valuation data, property data, direct mail enrichment, real estate data, targeted mailing, data enrichment service",
  authors: [{ name: "Peter Correia" }],
  icons: {
    icon: [
      { url: '/favicon-simple.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: '640x640' }
    ]
  },
  openGraph: {
    title: "Precision Data - Real Estate Valuation Data Enrichment for Direct Mail",
    description: "Transform your direct mail campaigns with premium real estate valuation data enrichment for precise targeting and higher ROI.",
    url: "https://precisiondataboost.com",
    siteName: "Precision Data",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en" className={spaceGrotesk.variable} style={{ scrollBehavior: 'smooth' }}>
      <body suppressHydrationWarning className="antialiased bg-background text-foreground">
        <PostHogProvider>
          {/* Add the IntersectionObserver component to enable animations */}
          <IntersectionObserver />
          <ScrollTracker />
          <SectionTracker />
          <ButtonTracker />
          <CTATracker />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
