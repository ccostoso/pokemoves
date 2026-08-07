import { afterAll, afterEach } from "vitest"
import { prisma } from "@/lib/prisma"

afterEach(async () => {
    // Wipe all app tables between tests so each test starts from a clean slate
    await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE "learnset_deck_item", "learnset_deck", "session", "account", "verification", "user" RESTART IDENTITY CASCADE',
    )
})

afterAll(async () => {
    await prisma.$disconnect()
})
