import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://kartoffel.branch-yesodot.org',
        changeOrigin: true,
        secure: false, 
      },
    },
    port: 3000,
    host: true,
  },
});
