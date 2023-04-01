import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
    assetsInlineLimit: 0,
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.hdr"],
  server: {
    open: true,
  },
});
