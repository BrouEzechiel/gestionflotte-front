import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // <-- Changé de 8080 à 5173
    strictPort: true, // <-- Ajouté pour empêcher Vite de changer de port tout seul
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    // Le tagger Lovable a été retiré pour le développement local
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
}));