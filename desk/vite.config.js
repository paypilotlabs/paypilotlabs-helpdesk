import frameworkUI from "@framework/ui/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import {
  getLocalFrappeUIDevConfig,
  importFrappeUIPlugin,
} from "./vite-helpers";

// The socket.io server's port from the bench's common_site_config.json (9000 when absent).
// The dev server proxies /socket.io there, so the app can use its own origin in dev too.
function getSocketioPort() {
  try {
    const config = path.resolve(__dirname, "../../../sites/common_site_config.json");
    return JSON.parse(fs.readFileSync(config, "utf8")).socketio_port || 9000;
  } catch {
    return 9000;
  }
}

export default defineConfig(async ({ mode }) => {
  const { useLocalFrappeUI, localFrappeUIAliases } = getLocalFrappeUIDevConfig({
    mode,
    rootDir: __dirname,
  });

  const frappeui = await importFrappeUIPlugin({ useLocalFrappeUI });
  const config = {
    plugins: [
      frappeui({
        frappeProxy: true,
        lucideIcons: true,
        jinjaBootData: true,
        buildConfig: {
          outDir: `../helpdesk/public/desk`,
          emptyOutDir: true,
          indexHtmlPath: "../helpdesk/www/helpdesk/index.html",
        },
        frappeTypes: {
          input: {
            helpdesk: [
              "hd_ticket_status",
              "hd_ticket",
              "hd_service_holiday_list",
              "hd_service_level_agreement",
              "hd_agent",
              "hd_team",
              "hd_customer",
            ],
            frappe: ["assignment_rule", "contact"],
          },
        },
      }),
      frameworkUI(),

      vue(),
      vueJsx(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        manifest: {
          display: "standalone",
          name: "PayPilotLabs Helpdesk",
          short_name: "Helpdesk",
          start_url: "/helpdesk",
          description:
            "Modern, Streamlined, Free and Open Source Customer Service Software",
          icons: [
            {
              src: "/assets/helpdesk/desk/manifest/manifest-icon-192.maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/assets/helpdesk/desk/manifest/manifest-icon-192.maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/assets/helpdesk/desk/manifest/manifest-icon-512.maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/assets/helpdesk/desk/manifest/manifest-icon-512.maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    server: {
      allowedHosts: true,
      proxy: {
        "^/socket.io": {
          target: `http://127.0.0.1:${getSocketioPort()}`,
          ws: true,
        },
      },
      fs: {
        // ".." = apps/helpdesk; "../.." = apps/, so the linked @framework/ui
        // (apps/frappe/ui) can be served from source in dev.
        allow: ["..", "../.."],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "tailwind.config.js": path.resolve(__dirname, "tailwind.config.js"),
        // @framework/ui still imports the `frappe-ui/editor-style.css` subpath,
        // dropped in frappe-ui 1.0.0-beta.63 (the editor entrypoint pulls its
        // own stylesheet now). Point it at the real file until frappe drops it.
        "frappe-ui/editor-style.css": path.resolve(
          __dirname,
          "node_modules/frappe-ui/src/molecules/editor/style.css"
        ),
        // ...localFrappeUIAliases,
      },
      // frappe-ui is served from source (excluded from optimizeDeps) and the
      // submodule ships its own node_modules with older tiptap/ProseMirror.
      // Force a single copy of each so the editor doesn't load two
      // prosemirror-state instances (RangeError: different instances of a keyed plugin).
      dedupe: [
        // @framework/ui imports from vue/frappe-ui; force a single instance of
        // each so its Combobox shares helpdesk's frappe-ui, not a second copy.
        // vue-router and dompurify are peers of @framework/ui, so they have
        // to come from helpdesk's copies
        "vue",
        "vue-router",
        "frappe-ui",
        "dompurify",
        "reka-ui",
        "@tiptap/core",
        "@tiptap/pm",
        "prosemirror-state",
        "prosemirror-model",
        "prosemirror-transform",
        "prosemirror-view",
        "prosemirror-keymap",
        "prosemirror-commands",
        "prosemirror-history",
        "prosemirror-gapcursor",
        "prosemirror-tables",
      ],
    },
    optimizeDeps: {
      include: [
        "tailwind.config.js",
        "prosemirror-state",
        "prosemirror-view",
        "prosemirror-gapcursor",
        "prosemirror-tables",
        "lowlight",
        "interactjs",
      ],
      exclude: ["frappe-ui", "@framework/ui"],
    },
  };
  return config;
});
