import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true
  },
  build: {
    outDir: 'dist', // ensure the dist folder is created
    rollupOptions: {
      input: 'src/server.js', // entry point for backend (server code)
    },
    rollupOptions: {
      external: ['@fullcalendar/core/preact.js', '@stripe/react-stripe-js']
    },
  },
});
