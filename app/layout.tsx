import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "QuantumMathResearchGPT - Multi-Agent AI Research Platform",
  description: "Explore quantum physics, mathematics, and scientific research with AI-powered insights",
  keywords: ["quantum computing", "mathematics", "physics", "AI", "research"],
  authors: [{ name: "QuantumMath Team" }],
  openGraph: {
    title: "QuantumMathResearchGPT",
    description: "Multi-agent AI for Mathematics, Quantum Physics, and Scientific Research",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0e27",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`}>
      <body className="bg-background text-foreground antialiased">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
