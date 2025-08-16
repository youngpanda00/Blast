import { defineConfig, loadEnv, type Plugin, type ViteDevServer, type ResolvedConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const PORT = 8086;
const IP = "0.0.0.0";
const SITEDEVURL = "https://site6.lofty.com";
const TARGETURL = "https://test.loftyblast.com";
// 将 /lovable-uploads 重写为 /${version}/lovable-uploads 的插件
function lovableUploadsVersioner(version: string): Plugin {
  const safeVersion = version || "listingblast";
  const escaped = safeVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`/(?!${escaped}/)lovable-uploads`, "g");
  return {
    name: "lovable-uploads-versioner",
    enforce: "post",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: { url?: string }, _res: unknown, next: (err?: unknown) => void) => {
        
        if (req.url && req.url.startsWith(`/assets/${safeVersion}/lovable-uploads`)) {
          console.log(`req.url: ${req.url}`)
          req.url = req.url.replace(`/assets/${safeVersion}/lovable-uploads`, "/lovable-uploads");
        }
        next();
      });
    },
    transform(code: string, id: string) {
      if (!/\.(js|ts|jsx|tsx|css|html)(\?|$)/.test(id)) return null;
      const replaced = code.replace(pattern, `/assets/${safeVersion}/lovable-uploads`);
      return replaced !== code ? { code: replaced, map: null } : null;
    },
    transformIndexHtml(html: string) {
      return html.replace(pattern, `/assets/${safeVersion}/lovable-uploads`);
    },
  };
}

// 构建结束后，将 dist/lovable-uploads 移动到 dist/assets/<version>/lovable-uploads
function relocateLovableUploads(version: string): Plugin {
  let resolved: ResolvedConfig;
  const safeVersion = version || "listingblast";

  function ensureDir(p: string) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }

  function moveOrCopyDir(src: string, dest: string) {
    if (!fs.existsSync(src)) return;
    ensureDir(path.dirname(dest));
    try {
      fs.renameSync(src, dest);
    } catch {
      // fallback: copy then remove
      const entries = fs.readdirSync(src, { withFileTypes: true });
      ensureDir(dest);
      for (const entry of entries) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          moveOrCopyDir(s, d);
        } else {
          fs.copyFileSync(s, d);
        }
      }
      fs.rmSync(src, { recursive: true, force: true });
    }
  }

  return {
    name: "relocate-lovable-uploads",
    apply: "build",
    configResolved(cfg) {
      resolved = cfg;
    },
    closeBundle() {
      const outDir = resolved?.build?.outDir || "dist";
      const src = path.resolve(process.cwd(), outDir, "lovable-uploads");
      const dest = path.resolve(process.cwd(), outDir, "assets", safeVersion, "lovable-uploads");
      moveOrCopyDir(src, dest);
    },
  };
}
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env.VITE_APP, 'env.VITE_APP')
  return {
    base: "/",
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
    plugins: [
      react(),
      lovableUploadsVersioner(env.VITE_APP),
      relocateLovableUploads(env.VITE_APP),
      mode === "development" && componentTagger(),
    ].filter(
      Boolean,
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      assetsDir: `assets/${env.VITE_APP}`,
      rollupOptions: {
        input: {
          // main: path.resolve(__dirname, 'index.html'),
          listingblast: path.resolve(__dirname, 'listingblast.html'),
        },
        external: ["jquery", "fabric", "vue", "vuex", "crm", "common", "broker"],
        output: {
          entryFileNames: `assets/${env.VITE_APP}/[name]-[hash].js`,
          chunkFileNames: `assets/${env.VITE_APP}/[name]-[hash].js`,
          assetFileNames: `assets/${env.VITE_APP}/[name]-[hash][extname]`,
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
  }
});
