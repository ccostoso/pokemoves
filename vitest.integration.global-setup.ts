import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { parse } from "dotenv"

// Runs once before the integration suite starts (separate process from the test workers,
// so it resolves DATABASE_URL independently rather than relying on vitest's `test.env`).
export default function setup() {
    const envTestPath = path.resolve(import.meta.dirname, ".env.test")
    const envFromFile = fs.existsSync(envTestPath) ? parse(fs.readFileSync(envTestPath)) : {}
    const databaseUrl = process.env.DATABASE_URL ?? envFromFile.DATABASE_URL

    if (!databaseUrl) {
        throw new Error(
            "DATABASE_URL is not set for integration tests. Create a .env.test file with a DATABASE_URL " +
                "pointing at a disposable test database, or set DATABASE_URL in the environment before " +
                "running `pnpm test:integration`.",
        )
    }

    execSync("pnpm exec prisma migrate deploy", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: databaseUrl },
    })
}
