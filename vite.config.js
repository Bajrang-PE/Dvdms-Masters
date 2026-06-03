import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5177,
    //  proxy: {
    //   '/hp-api': {
    //     target: "http://10.226.27.173:8082",
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
    // proxy: {
    //   '/hp-api': {
    //     target: "http://10.226.27.173:8082",
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
});
