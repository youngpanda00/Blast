import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const PORT = 8086;
const IP = "0.0.0.0";
const SITEDEVURL = "https://site6.lofty.com";
const TARGETURL = "https://test.loftyblast.com";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8077,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: TARGETURL,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      "/site-api": {
        target: TARGETURL,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      "/payment-api": {
        target: TARGETURL,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      "/listing-crm": {
        target: TARGETURL,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      "/api-site": {
        target: SITEDEVURL,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
      "/static": {
        target: `https://${IP}:${PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ["jquery", "fabric", "vue", "vuex", "crm", "common", "broker"],
      output: {
        globals: {
          jquery: "jQuery",
          fabric: "fabric",
          vue: "Vue",
          vuex: "Vuex",
          crm: "crm",
          common: "common",
          broker: "broker",
        },
      },
    },
  },
}));
