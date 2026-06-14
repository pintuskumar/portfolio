import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "Pintu Kumar";
const DEFAULT_TITLE = "Pintu Kumar — Full Stack Developer & Software Engineer";
const DEFAULT_DESC =
  "Portfolio of Pintu Kumar — Full Stack Developer building scalable web applications with React, Node.js, TypeScript, and PostgreSQL. Based in Mumbai, India.";
const DEFAULT_IMAGE = "/og-image.svg";
export const SITE_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;
  const url =
    canonical ??
    (typeof window !== "undefined" ? window.location.href : SITE_URL);
  const trimmedDesc = description.length > 160 ? `${description.slice(0, 157)}...` : description;
  const ldArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={trimmedDesc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={trimmedDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={trimmedDesc} />
      <meta name="twitter:image" content={image} />

      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
}
