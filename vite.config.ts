import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
    plugins: [solidPlugin()],
    base: "/data-flow/",
    server: {
        host: "0.0.0.0",
    },
    build: {
        target: "esnext",
    },
    resolve: {
        conditions: ["development", "browser"],
    },
})
