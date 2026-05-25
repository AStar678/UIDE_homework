import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig({
  plugins: [vue(), viteSingleFile({ removeViteModuleLoader: true })],
  server: { port: 5173 },
  build: {
    target: "es2018",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    minify: "terser",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        format: "iife",
        name: "SocialEchoApp",
      },
    },
  },
});
