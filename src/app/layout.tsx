import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PostHogProvider from "../components/PostHogProvider";
import JsonLd from "../components/JsonLd";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pintu Kumar | Full Stack Software Developer",
  description:
    "Portfolio of Pintu Kumar - Full Stack Software Developer specializing in React, Node.js, TypeScript, and cloud technologies. 3+ years of experience building scalable web applications.",
  keywords: [
    "Pintu Kumar",
    "Full Stack Developer",
    "React",
    "Node.js",
    "TypeScript",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Pintu Kumar" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pintukumar.dev"
  ),
  openGraph: {
    title: "Pintu Kumar | Full Stack Software Developer",
    description:
      "Full Stack Software Developer specializing in React, Node.js, and cloud technologies.",
    type: "website",
    siteName: "Pintu Kumar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pintu Kumar | Full Stack Software Developer",
    description:
      "Full Stack Software Developer specializing in React, Node.js, and cloud technologies.",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-gray-950 text-gray-50`}
      >
        <PostHogProvider>{children}</PostHogProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
