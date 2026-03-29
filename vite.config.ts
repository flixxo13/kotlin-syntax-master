import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Kotlin Master",
          short_name: "KotlinMaster",
          description: "Lerne Kotlin Syntax offline",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/icon-192x192.png",
              sizes: "192x192",
              type: "image/png"
            }
          ]
        }
      })
    ],
    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./")
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true"
    }
  };
});
