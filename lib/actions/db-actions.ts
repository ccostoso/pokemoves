"use server"

import { prisma } from "@/lib/prisma"
import { LearnsetDeckTitleSchema } from "@/lib/schemas"
import { LearnsetDeckItem } from "@/lib/types"
import { getServerSession } from "@/lib/auth-server"
import { revalidatePath } from "next/cache"

export async function createLearnsetDeck(name: string, learnsetDeck: LearnsetDeckItem[]): Promise<string> {
    const session = await getServerSession()
    if (!session?.user?.id) {
        throw new Error("User is not authenticated.")
    }

    const userId = session.user.id

    const validatedLearnsetName = LearnsetDeckTitleSchema.parse(name)

    const createdLearnsetDeck = await prisma.learnsetDeck.create({
        data: {
            userId,
            name: validatedLearnsetName,
            items: {
                createMany: {
                    data: learnsetDeck.map((learnset, index) => ({
                        pokemonId: learnset.pokemonId,
                        pokemonName: learnset.pokemonName,
                        versionGroupName: learnset.versionGroupName,
                        sortOrder: index,
                    })),
                },
            },
        },
        select: {
            id: true,
        },
    })

    return createdLearnsetDeck.id
}

export async function getLearnsetDeckItemById(deckId: string): Promise<LearnsetDeckItem[] | null> {
    const learnsetDeck = await prisma.learnsetDeck.findUnique({
        where: { id: deckId },
        include: {
            items: {
                orderBy: { sortOrder: "asc" },
            },
        },
    })

    if (!learnsetDeck) {
        return null
    }

    return learnsetDeck.items.map((item) => ({
        pokemonId: item.pokemonId,
        pokemonName: item.pokemonName,
        versionGroupName: item.versionGroupName,
        sortOrder: item.sortOrder,
    }))
}

export async function getLearnsetDeckMetadataById(deckId: string): Promise<{ userId: string, name: string } | null> {
    const learnsetDeck = await prisma.learnsetDeck.findUnique({
        where: { id: deckId },
        select: { userId: true, name: true },
    })

    return learnsetDeck ?? null
}

export async function getAllLearnsetDecksWithLearnsetDeckItemsByUserId(
    userId: string,
): Promise<{ id: string, name: string, items: LearnsetDeckItem[] }[]> {
    const learnsetDecks = await prisma.learnsetDeck.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            items: {
                select: {
                    pokemonId: true,
                    pokemonName: true,
                    versionGroupName: true,
                    sortOrder: true,
                },
                orderBy: { sortOrder: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    return learnsetDecks
}

export async function updateLearnsetDeck(
    deckId: string,
    name: string,
    learnsetDeck: LearnsetDeckItem[],
): Promise<string> {
    const validatedLearnsetName = LearnsetDeckTitleSchema.parse(name)

    const session = await getServerSession()
    if (!session?.user?.id) {
        throw new Error("User is not authenticated.")
    }

    const updatedDeck = await prisma.$transaction(async (tx) => {
        const deck = await tx.learnsetDeck.findUniqueOrThrow({
            where: { id: deckId },
            select: { userId: true },
        })

        if (deck.userId !== session.user.id) {
            throw new Error("User does not have permission to update this learnset deck.")
        }

        await tx.learnsetDeckItem.deleteMany({ where: { deckId } })

        await tx.learnsetDeckItem.createMany({
            data: learnsetDeck.map((item, index) => ({
                deckId,
                pokemonId: item.pokemonId,
                pokemonName: item.pokemonName,
                versionGroupName: item.versionGroupName,
                sortOrder: index,
            })),
        })

        return tx.learnsetDeck.update({
            where: { id: deckId },
            data: { name: validatedLearnsetName },
            select: { id: true },
        })
    })

    return updatedDeck.id
}

export async function deleteLearnsetDeck(deckId: string): Promise<void> {
    if (!deckId) {
        throw new Error("Invalid deck ID.")
    }

    const session = await getServerSession()
    if (!session?.user?.id) {
        throw new Error("User is not authenticated.")
    }

    const deck = await prisma.learnsetDeck.findUniqueOrThrow({
        where: { id: deckId },
        select: { userId: true },
    })

    if (deck.userId !== session.user.id) {
        throw new Error("User does not have permission to delete this learnset deck.")
    }

    await prisma.$transaction([
        prisma.learnsetDeckItem.deleteMany({ where: { deckId } }),
        prisma.learnsetDeck.delete({ where: { id: deckId } }),
    ])

    revalidatePath("/account/decks")
}
