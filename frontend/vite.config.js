import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const envMode = process.env.NODE_ENV === "production" ? "production" : "";
const env = loadEnv(envMode, process.cwd(), "");

export default defineConfig({
    plugins: [vue()],
    server: {
        strictPort: true,
        port: env.PORT,
    },
    base: "/",
    assetsDir: "/",
    devServer: {
        allowedHosts: ["srv16.mikr.us"],
    },
    define: {
        BACKEND_URL: JSON.stringify(env.VITE_APP_BACKEND_URL),
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
