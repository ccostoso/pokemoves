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
    if (!session.user.emailVerified) {
        throw new Error("You must verify your email before saving or duplicating a learnset deck.")
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
                        pokemonApiName: learnset.pokemonApiName,
                        pokemonDisplayName: learnset.pokemonDisplayName,
                        versionGroupApiName: learnset.versionGroupApiName,
                        versionGroupDisplayName: learnset.versionGroupDisplayName,
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
        pokemonApiName: item.pokemonApiName,
        pokemonDisplayName: item.pokemonDisplayName,
        versionGroupApiName: item.versionGroupApiName,
        versionGroupDisplayName: item.versionGroupDisplayName,
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
): Promise<{ id: string, name: string, updatedAt: Date, items: LearnsetDeckItem[] }[]> {
    const learnsetDecks = await prisma.learnsetDeck.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            updatedAt: true,
            items: {
                select: {
                    pokemonId: true,
                    pokemonApiName: true,
                    pokemonDisplayName: true,
                    versionGroupApiName: true,
                    versionGroupDisplayName: true,
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
                pokemonApiName: item.pokemonApiName,
                pokemonDisplayName: item.pokemonDisplayName,
                versionGroupApiName: item.versionGroupApiName,
                versionGroupDisplayName: item.versionGroupDisplayName,
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
