import { afterEach, describe, expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import { LearnsetDeckItem } from "@/lib/types"

const getServerSessionMock = vi.hoisted(() => vi.fn())
const revalidatePathMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth-server", () => ({ getServerSession: getServerSessionMock }))
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }))

const {
    createLearnsetDeck,
    getAllLearnsetDecksWithLearnsetDeckItemsByUserId,
    updateLearnsetDeck,
    deleteLearnsetDeck,
} = await import("./db-actions")

function makeDeckItem(overrides: Partial<LearnsetDeckItem> = {}): LearnsetDeckItem {
    return {
        pokemonId: 25,
        pokemonApiName: "pikachu",
        pokemonDisplayName: "Pikachu",
        versionGroupApiName: "red-blue",
        versionGroupDisplayName: "Red & Blue",
        sortOrder: 0,
        ...overrides,
    }
}

async function createTestUser(overrides: { emailVerified?: boolean } = {}) {
    return prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            name: "Trainer Red",
            email: `${crypto.randomUUID()}@example.com`,
            emailVerified: overrides.emailVerified ?? true,
        },
    })
}

function mockSessionFor(userId: string, emailVerified = true) {
    getServerSessionMock.mockResolvedValue({ user: { id: userId, emailVerified } })
}

afterEach(() => {
    vi.clearAllMocks()
})

describe("createLearnsetDeck (integration)", () => {
    it("persists the deck and its items in the database", async () => {
        const user = await createTestUser()
        mockSessionFor(user.id)

        const items = [
            makeDeckItem({ pokemonApiName: "pikachu", versionGroupApiName: "red-blue" }),
            makeDeckItem({ pokemonApiName: "bulbasaur", versionGroupApiName: "yellow" }),
        ]

        const deckId = await createLearnsetDeck("My Deck", items)

        const persisted = await prisma.learnsetDeck.findUniqueOrThrow({
            where: { id: deckId },
            include: { items: { orderBy: { sortOrder: "asc" } } },
        })

        expect(persisted.userId).toBe(user.id)
        expect(persisted.name).toBe("My Deck")
        expect(persisted.items.map((item) => item.pokemonApiName)).toEqual(["pikachu", "bulbasaur"])
        expect(persisted.items.map((item) => item.sortOrder)).toEqual([0, 1])
    })

    it("rejects a duplicate pokemon/version-group pair within the same deck", async () => {
        // The DB has a unique constraint on (deckId, pokemonApiName, versionGroupApiName) — mocked
        // Prisma tests can't catch this, only a real database enforces it.
        const user = await createTestUser()
        mockSessionFor(user.id)

        const items = [
            makeDeckItem({ pokemonApiName: "pikachu", versionGroupApiName: "red-blue" }),
            makeDeckItem({ pokemonApiName: "pikachu", versionGroupApiName: "red-blue" }),
        ]

        await expect(createLearnsetDeck("Duplicate Deck", items)).rejects.toThrow()
    })
})

describe("getAllLearnsetDecksWithLearnsetDeckItemsByUserId (integration)", () => {
    it("only returns decks belonging to the given user", async () => {
        const userA = await createTestUser()
        const userB = await createTestUser()

        mockSessionFor(userA.id)
        await createLearnsetDeck("User A Deck", [makeDeckItem()])

        mockSessionFor(userB.id)
        await createLearnsetDeck("User B Deck", [makeDeckItem()])

        const decksForA = await getAllLearnsetDecksWithLearnsetDeckItemsByUserId(userA.id)

        expect(decksForA).toHaveLength(1)
        expect(decksForA[0].name).toBe("User A Deck")
    })
})

describe("updateLearnsetDeck (integration)", () => {
    it("rejects updates from a user who does not own the deck", async () => {
        const owner = await createTestUser()
        const intruder = await createTestUser()

        mockSessionFor(owner.id)
        const deckId = await createLearnsetDeck("Original Name", [makeDeckItem()])

        mockSessionFor(intruder.id)
        await expect(updateLearnsetDeck(deckId, "Hijacked Name", [makeDeckItem()])).rejects.toThrow(
            "User does not have permission to update this learnset deck.",
        )

        const unchanged = await prisma.learnsetDeck.findUniqueOrThrow({ where: { id: deckId } })
        expect(unchanged.name).toBe("Original Name")
    })

    it("replaces the deck's items and renames it when the owner updates it", async () => {
        const owner = await createTestUser()
        mockSessionFor(owner.id)

        const deckId = await createLearnsetDeck("Original Name", [
            makeDeckItem({ pokemonApiName: "pikachu" }),
        ])

        await updateLearnsetDeck(deckId, "Renamed Deck", [
            makeDeckItem({ pokemonApiName: "bulbasaur" }),
            makeDeckItem({ pokemonApiName: "charmander" }),
        ])

        const updated = await prisma.learnsetDeck.findUniqueOrThrow({
            where: { id: deckId },
            include: { items: { orderBy: { sortOrder: "asc" } } },
        })

        expect(updated.name).toBe("Renamed Deck")
        expect(updated.items.map((item) => item.pokemonApiName)).toEqual(["bulbasaur", "charmander"])
    })
})

describe("deleteLearnsetDeck (integration)", () => {
    it("rejects deletion from a user who does not own the deck", async () => {
        const owner = await createTestUser()
        const intruder = await createTestUser()

        mockSessionFor(owner.id)
        const deckId = await createLearnsetDeck("Protected Deck", [makeDeckItem()])

        mockSessionFor(intruder.id)
        await expect(deleteLearnsetDeck(deckId)).rejects.toThrow(
            "User does not have permission to delete this learnset deck.",
        )

        await expect(prisma.learnsetDeck.findUniqueOrThrow({ where: { id: deckId } })).resolves.toBeTruthy()
    })

    it("deletes the deck and its items when the owner deletes it", async () => {
        const owner = await createTestUser()
        mockSessionFor(owner.id)

        const deckId = await createLearnsetDeck("Deck To Delete", [makeDeckItem()])

        await deleteLearnsetDeck(deckId)

        await expect(prisma.learnsetDeck.findUnique({ where: { id: deckId } })).resolves.toBeNull()
        const remainingItems = await prisma.learnsetDeckItem.findMany({ where: { deckId } })
        expect(remainingItems).toHaveLength(0)
        expect(revalidatePathMock).toHaveBeenCalledWith("/account/decks")
    })
})

describe("User deletion cascade (integration)", () => {
    it("removes a user's learnset decks when the user is deleted", async () => {
        const user = await createTestUser()
        mockSessionFor(user.id)

        const deckId = await createLearnsetDeck("Cascade Deck", [makeDeckItem()])

        await prisma.user.delete({ where: { id: user.id } })

        await expect(prisma.learnsetDeck.findUnique({ where: { id: deckId } })).resolves.toBeNull()
    })
})
