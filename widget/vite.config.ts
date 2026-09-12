import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build: un solo file dist/widget.js con React e CSS dentro.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": '"production"' },
  build: {
    lib: { entry: "src/main.tsx", name: "DentistChat", formats: ["iife"], fileName: () => "widget.js" },
    cssCodeSplit: false,
  },
});
