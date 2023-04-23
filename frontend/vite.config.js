import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const envMode = process.env.NODE_ENV === "production" ? "production" : "";
const env = loadEnv(envMode, process.cwd(), "");

import { execSync } from "child_process";
const commitHash = execSync("git rev-parse HEAD").toString();
const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString();

export default defineConfig({
    plugins: [vue()],
    server: {
        strictPort: true,
        port: env.PORT,
    },
    base: "/",
    assetsDir: "/",
    devServer: {
        allowedHosts: ["algodebug.pl"],
    },
    define: {
        BACKEND_URL: JSON.stringify(env.VITE_APP_BACKEND_URL),
        GIT_COMMIT_HASH: JSON.stringify(commitHash),
        GIT_BRANCH_NAME: JSON.stringify(branchName),
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
