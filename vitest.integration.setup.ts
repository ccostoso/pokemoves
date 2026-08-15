import { afterAll, afterEach } from "vitest"
import { prisma } from "@/lib/prisma"
import { assertDisposableTestDatabase } from "./vitest.integration.db-guard"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL is not set for integration tests. Ensure vitest.integration.config.mts sets test.env.DATABASE_URL (or set DATABASE_URL in the environment).",
    )
}
assertDisposableTestDatabase(databaseUrl)

afterEach(async () => {
    // Wipe all app tables between tests so each test starts from a clean slate
    await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE "learnset_deck_item", "learnset_deck", "session", "account", "verification", "user" RESTART IDENTITY CASCADE',
    )
})

afterAll(async () => {
    await prisma.$disconnect()
})
