import { beforeEach, describe, expect, it, vi } from "vitest"
import { LearnsetDeckItem } from "@/lib/types"

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        learnsetDeck: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findUniqueOrThrow: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        learnsetDeckItem: {
            deleteMany: vi.fn(),
            createMany: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

const getServerSessionMock = vi.hoisted(() => vi.fn())
const revalidatePathMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/auth/auth-server", () => ({ getServerSession: getServerSessionMock }))
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }))

const {
    createLearnsetDeck,
    getLearnsetDeckItemById,
    getLearnsetDeckMetadataById,
    getAllLearnsetDecksWithLearnsetDeckItemsByUserId,
    updateLearnsetDeck,
    deleteLearnsetDeck,
} = await import("./db-actions")

function makeSession(overrides: { id?: string, emailVerified?: boolean } = {}) {
    return {
        user: {
            id: overrides.id ?? "user-1",
            emailVerified: overrides.emailVerified ?? true,
        },
    }
}

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

beforeEach(() => {
    vi.clearAllMocks()

    // Default $transaction behavior: run the callback with the mock as `tx`, or resolve an array of promises
    prismaMock.$transaction.mockImplementation(async (arg: unknown) => {
        if (typeof arg === "function") {
            return (arg as (tx: typeof prismaMock) => unknown)(prismaMock)
        }
        return Promise.all(arg as Promise<unknown>[])
    })
})

describe("createLearnsetDeck", () => {
    it("throws when there is no session", async () => {
        getServerSessionMock.mockResolvedValue(null)

        await expect(createLearnsetDeck("My Deck", [makeDeckItem()])).rejects.toThrow(
            "User is not authenticated.",
        )
        expect(prismaMock.learnsetDeck.create).not.toHaveBeenCalled()
    })

    it("throws when the user's email is not verified", async () => {
        getServerSessionMock.mockResolvedValue(makeSession({ emailVerified: false }))

        await expect(createLearnsetDeck("My Deck", [makeDeckItem()])).rejects.toThrow(
            "You must verify your email before saving or duplicating a learnset deck.",
        )
        expect(prismaMock.learnsetDeck.create).not.toHaveBeenCalled()
    })

    it("throws when the name fails schema validation", async () => {
        getServerSessionMock.mockResolvedValue(makeSession())

        await expect(createLearnsetDeck("", [makeDeckItem()])).rejects.toThrow()
        expect(prismaMock.learnsetDeck.create).not.toHaveBeenCalled()
    })

    it("creates the deck with mapped items and returns the new id", async () => {
        getServerSessionMock.mockResolvedValue(makeSession({ id: "user-42" }))
        prismaMock.learnsetDeck.create.mockResolvedValue({ id: "deck-1" })

        const items = [makeDeckItem({ pokemonApiName: "pikachu" }), makeDeckItem({ pokemonApiName: "bulbasaur" })]

        const result = await createLearnsetDeck("My Deck", items)

        expect(result).toBe("deck-1")
        expect(prismaMock.learnsetDeck.create).toHaveBeenCalledWith({
            data: {
                userId: "user-42",
                name: "My Deck",
                items: {
                    createMany: {
                        data: items.map((item, index) => ({
                            pokemonId: item.pokemonId,
                            pokemonApiName: item.pokemonApiName,
                            pokemonDisplayName: item.pokemonDisplayName,
                            versionGroupApiName: item.versionGroupApiName,
                            versionGroupDisplayName: item.versionGroupDisplayName,
                            sortOrder: index,
                        })),
                    },
                },
            },
            select: { id: true },
        })
    })
})

describe("getLearnsetDeckItemById", () => {
    it("returns null when the deck is not found", async () => {
        prismaMock.learnsetDeck.findUnique.mockResolvedValue(null)

        expect(await getLearnsetDeckItemById("missing-deck")).toBeNull()
    })

    it("maps the deck's items in the order returned by the query", async () => {
        prismaMock.learnsetDeck.findUnique.mockResolvedValue({
            items: [
                { ...makeDeckItem({ pokemonApiName: "pikachu", sortOrder: 0 }) },
                { ...makeDeckItem({ pokemonApiName: "bulbasaur", sortOrder: 1 }) },
            ],
        })

        const result = await getLearnsetDeckItemById("deck-1")

        expect(result).toEqual([
            makeDeckItem({ pokemonApiName: "pikachu", sortOrder: 0 }),
            makeDeckItem({ pokemonApiName: "bulbasaur", sortOrder: 1 }),
        ])
    })
})

describe("getLearnsetDeckMetadataById", () => {
    it("returns null when the deck is not found", async () => {
        prismaMock.learnsetDeck.findUnique.mockResolvedValue(null)

        expect(await getLearnsetDeckMetadataById("missing-deck")).toBeNull()
    })

    it("returns the deck's userId and name when found", async () => {
        prismaMock.learnsetDeck.findUnique.mockResolvedValue({ userId: "user-1", name: "My Deck" })

        expect(await getLearnsetDeckMetadataById("deck-1")).toEqual({ userId: "user-1", name: "My Deck" })
    })
})

describe("getAllLearnsetDecksWithLearnsetDeckItemsByUserId", () => {
    it("returns the decks for the given user", async () => {
        const decks = [{ id: "deck-1", name: "My Deck", updatedAt: new Date(), items: [makeDeckItem()] }]
        prismaMock.learnsetDeck.findMany.mockResolvedValue(decks)

        const result = await getAllLearnsetDecksWithLearnsetDeckItemsByUserId("user-1")

        expect(result).toBe(decks)
        expect(prismaMock.learnsetDeck.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { userId: "user-1" } }),
        )
    })
})

describe("updateLearnsetDeck", () => {
    it("throws when the name fails schema validation, before checking the session", async () => {
        await expect(updateLearnsetDeck("deck-1", "", [makeDeckItem()])).rejects.toThrow()
        expect(getServerSessionMock).not.toHaveBeenCalled()
    })

    it("throws when there is no session", async () => {
        getServerSessionMock.mockResolvedValue(null)

        await expect(updateLearnsetDeck("deck-1", "My Deck", [makeDeckItem()])).rejects.toThrow(
            "User is not authenticated.",
        )
    })

    it("throws when the deck does not belong to the current user", async () => {
        getServerSessionMock.mockResolvedValue(makeSession({ id: "user-1" }))
        prismaMock.learnsetDeck.findUniqueOrThrow.mockResolvedValue({ userId: "someone-else" })

        await expect(updateLearnsetDeck("deck-1", "My Deck", [makeDeckItem()])).rejects.toThrow(
            "User does not have permission to update this learnset deck.",
        )
        expect(prismaMock.learnsetDeckItem.deleteMany).not.toHaveBeenCalled()
    })

    it("replaces the deck items and updates the name when the user owns the deck", async () => {
        getServerSessionMock.mockResolvedValue(makeSession({ id: "user-1" }))
        prismaMock.learnsetDeck.findUniqueOrThrow.mockResolvedValue({ userId: "user-1" })
        prismaMock.learnsetDeck.update.mockResolvedValue({ id: "deck-1" })

        const result = await updateLearnsetDeck("deck-1", "  Renamed Deck  ", [makeDeckItem()])

        expect(result).toBe("deck-1")
        expect(prismaMock.learnsetDeckItem.deleteMany).toHaveBeenCalledWith({ where: { deckId: "deck-1" } })
        expect(prismaMock.learnsetDeckItem.createMany).toHaveBeenCalled()
        expect(prismaMock.learnsetDeck.update).toHaveBeenCalledWith({
            where: { id: "deck-1" },
            data: { name: "Renamed Deck" },
            select: { id: true },
        })
    })
})

describe("deleteLearnsetDeck", () => {
    it("throws when no deckId is given", async () => {
        await expect(deleteLearnsetDeck("")).rejects.toThrow("Invalid deck ID.")
        expect(getServerSessionMock).not.toHaveBeenCalled()
    })

    it("throws when there is no session", async () => {
        getServerSessionMock.mockResolvedValue(null)

        await expect(deleteLearnsetDeck("deck-1")).rejects.toThrow("User is not authenticated.")
    })

    it("throws when the deck does not belong to the current user", async () => {
        getServerSessionMock.mockResolvedValue(makeSession({ id: "user-1" }))
        prismaMock.learnsetDeck.findUniqueOrThrow.mockResolvedValue({ userId: "someone-else" })

        await expect(deleteLearnsetDeck("deck-1")).rejects.toThrow(
            "User does not have permission to delete this learnset deck.",
        )
        expect(prismaMock.learnsetDeck.delete).not.toHaveBeenCalled()
    })

    it("deletes the deck's items and the deck, then revalidates the decks page", async () => {
        getServerSessionMock.mockResolvedValue(makeSession({ id: "user-1" }))
        prismaMock.learnsetDeck.findUniqueOrThrow.mockResolvedValue({ userId: "user-1" })
        prismaMock.learnsetDeckItem.deleteMany.mockResolvedValue({ count: 1 })
        prismaMock.learnsetDeck.delete.mockResolvedValue({ id: "deck-1" })

        await deleteLearnsetDeck("deck-1")

        expect(prismaMock.learnsetDeckItem.deleteMany).toHaveBeenCalledWith({ where: { deckId: "deck-1" } })
        expect(prismaMock.learnsetDeck.delete).toHaveBeenCalledWith({ where: { id: "deck-1" } })
        expect(revalidatePathMock).toHaveBeenCalledWith("/account/decks")
    })
})
