export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pintu Kumar",
    jobTitle: "Full Stack Software Engineer",
    url: "https://pintukumar.dev",
    email: "pksharmagh4@gmail.com",
    sameAs: [
      "https://github.com/pintu544",
      "https://linkedin.com/in/pintukumar12",
    ],
    knowsAbout: [
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
      "Tailwind CSS",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Kurukshetra University",
    },
    worksFor: {
      "@type": "Organization",
      name: "Secure Access Tech Pvt Ltd",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pintu Kumar Portfolio",
    url: "https://pintukumar.dev",
    description:
      "Portfolio of Pintu Kumar - Full Stack Software Engineer specializing in React, Node.js, TypeScript, and cloud technologies.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
