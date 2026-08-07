import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "."),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        include: ["**/*.test.{ts,tsx}"],
        exclude: ["node_modules", ".next", "generated", "**/*.integration.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    },
})
