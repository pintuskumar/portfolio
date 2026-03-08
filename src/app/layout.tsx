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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pintukumar.dev";

export const metadata: Metadata = {
  title: {
    default: "Pintu Kumar | Full Stack Software Developer",
    template: "%s | Pintu Kumar",
  },
  description:
    "Portfolio of Pintu Kumar - Full Stack Software Developer specializing in React, Node.js, TypeScript, and cloud technologies. 3+ years of experience building scalable web applications.",
  keywords: [
    "Pintu Kumar",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Node.js Developer",
    "TypeScript",
    "Next.js",
    "Portfolio",
    "Web Developer India",
    "Cloud Technologies",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Pintu Kumar", url: siteUrl }],
  creator: "Pintu Kumar",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pintu Kumar | Full Stack Software Developer",
    description:
      "Full Stack Software Developer with 3+ years of experience specializing in React, Node.js, TypeScript, and cloud technologies. Building scalable web applications across healthcare, logistics, and e-commerce.",
    type: "website",
    siteName: "Pintu Kumar Portfolio",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pintu Kumar | Full Stack Software Developer",
    description:
      "Full Stack Software Developer specializing in React, Node.js, and cloud technologies.",
    creator: "@pintukumar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
