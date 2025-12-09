import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { TranslationProvider } from "@/components/i18n/translation-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://analyticspill.example.com"),
  title: {
    default: "AnalyticsPill | Trusted Medical Information",
    template: "%s | AnalyticsPill",
  },
  description:
    "Discover accurate, accessible medical information with tools, guides, and trusted resources designed for patients and healthcare professionals.",
  keywords: [
    "medical information",
    "drug interactions",
    "pill identifier",
    "dosage calculator",
    "health guides",
  ],
  authors: [{ name: "AnalyticsPill" }],
  creator: "AnalyticsPill",
  openGraph: {
    title: "AnalyticsPill | Trusted Medical Information",
    description:
      "Search medications, check interactions, identify pills, and access reliable health information.",
    url: "https://analyticspill.example.com",
    siteName: "AnalyticsPill",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AnalyticsPill medical knowledge platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnalyticsPill | Trusted Medical Information",
    description:
      "Explore medications, health guides, and clinical tools built to inspire confidence in medical decisions.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.variable,
          poppins.variable
        )}
      >
        <TranslationProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
