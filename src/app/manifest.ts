import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pintu Kumar | Full Stack Software Developer",
    short_name: "Pintu Kumar",
    description:
      "Portfolio of Pintu Kumar - Full Stack Software Developer specializing in React, Node.js, TypeScript, and cloud technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
