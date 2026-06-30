"use server"

import { prisma } from "@/lib/prisma"
import { LearnsetDeckItemData } from "@/lib/types"

export async function saveLearnset(userId: string, name: string, learnsetDeck: LearnsetDeckItemData[]): Promise<void> {
    await prisma.learnsetDeck.create({
        data: {
            userId,
            name,
            items: {
                createMany: {
                    data: learnsetDeck.map((learnset, index) => ({
                        pokemonName: learnset.pokemonName,
                        versionGroupName: learnset.versionGroupName,
                        sortOrder: index,
                    }))
                }
            }
        }
    })
}

export async function getLearnsetDeckById(deckId: string): Promise<LearnsetDeckItemData[] | null> {
    const learnsetDeck = await prisma.learnsetDeck.findUnique({
        where: { id: deckId },
        include: {
            items: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    })

    if (!learnsetDeck) {
        return null
    }

    return learnsetDeck.items.map(item => ({
        pokemonName: item.pokemonName,
        versionGroupName: item.versionGroupName,
        sortOrder: item.sortOrder,
    }))
}

export async function getLearnsetDeckOwnerId(deckId: string): Promise<string | null> {
    const learnsetDeck = await prisma.learnsetDeck.findUnique({
        where: { id: deckId },
        select: { userId: true },
    })

    return learnsetDeck?.userId ?? null
}