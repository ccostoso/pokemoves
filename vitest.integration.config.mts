import fs from "node:fs"
import path from "node:path"
import { parse } from "dotenv"
import { defineConfig } from "vitest/config"

const envTestPath = path.resolve(import.meta.dirname, ".env.test")
const envFromFile = fs.existsSync(envTestPath) ? parse(fs.readFileSync(envTestPath)) : {}

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "."),
        },
    },
    test: {
        environment: "node",
        include: ["**/*.integration.test.ts"],
        exclude: ["node_modules", ".next", "generated"],
        env: {
            // CI can set a real DATABASE_URL directly; .env.test is the local dev fallback
            DATABASE_URL: process.env.DATABASE_URL ?? envFromFile.DATABASE_URL,
        },
        setupFiles: ["./vitest.integration.setup.ts"],
        globalSetup: ["./vitest.integration.global-setup.ts"],
        // Tests share one real database, so run test files sequentially to avoid clobbering each other
        fileParallelism: false,
        hookTimeout: 30_000,
        testTimeout: 15_000,
    },
})
