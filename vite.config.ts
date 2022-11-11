import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
    plugins: [solid()],
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
    test: {
        deps: {
            registerNodeLoader: true,
        },
    },
})
