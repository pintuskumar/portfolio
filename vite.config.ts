import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Group anything that depends on React internals into the React vendor
          // chunk to avoid "Cannot read properties of undefined (reading 'createContext')"
          // caused by load-order races between split chunks.
          if (
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/react-i18next/") ||
            id.includes("/react-helmet") ||
            id.match(/\/react\//) ||
            id.includes("/scheduler/")
          ) {
            return "react-vendor";
          }
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("react-markdown") || id.includes("remark") || id.includes("micromark") || id.includes("mdast")) {
            return "markdown";
          }
          if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("cmdk") || id.includes("vaul")) {
            return "ui-vendor";
          }
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("i18next")) return "i18n";
        },

      },
    },
  },
}));
