import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [vue()],
    server: {
        strictPort: true,
        port: 8000,

    },
    base: "/",
    assetsDir: "/",
    devServer: {
        allowedHosts: ["srv16.mikr.us"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
