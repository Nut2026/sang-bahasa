import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  adapter: vercel(),

  output: "server",

  site: process.env.PUBLIC_SITE_URL || "https://sang-bahasa.vercel.app",

  build: {
    assets: "_assets",
  },

  server: {
    port: 4321,
    host: true,
  },

  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;

        if (path.startsWith("/search")) {
          return false;
        }

        if (path.includes("/kamus/semua/")) return false;

        return true;
      },
    }),
  ],
});
