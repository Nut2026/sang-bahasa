// ============================================================
// Sang Bahasa — Astro Configuration (Astro 6.0 + Vercel)
// ============================================================

import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel"; // Simplified import for Astro 6
import sitemap from "@astrojs/sitemap"; // Crucial for Google discovery

export default defineConfig({
  // The Adapter tells Astro how to run on Vercel's servers
  adapter: vercel(),

  // "static" is the default in Astro 6.
  // We handle dynamic pages using 'export const prerender = false'
  // inside the specific .astro files.
  output: "static",

  // CRITICAL: Replace with your actual .vercel.app URL once live.
  // Google uses this to build your sitemap and find your words.
  site: process.env.PUBLIC_SITE_URL || "https://sang-bahasa.vercel.app",

  build: {
    assets: "_assets",
  },

  server: {
    port: 4321,
    host: true,
  },
  
  // In Astro 6, you don't need the 'vite: { define: ... }' block for 
  // variables starting with PUBLIC_. Astro handles them automatically!
  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;
        
        // Exclude ONLY root-level /search paths
        if (path.startsWith('/search')) {
          return false;
        }
        
        // Exclude these as before
        if (path.includes('/kamus/semua/')) return false;
        
        // Keep everything else, including /kamus/*/search
        return true;
      },
    }),
  ],
});