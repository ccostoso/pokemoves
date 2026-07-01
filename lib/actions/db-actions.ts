"use server"

import { prisma } from "@/lib/prisma"
import { LearnsetDeckTitleSchema } from "@/lib/schemas"
import { LearnsetDeckItemData } from "@/lib/types"

export async function saveLearnset(userId: string, name: string, learnsetDeck: LearnsetDeckItemData[]): Promise<string> {
    const validatedLearnsetName = LearnsetDeckTitleSchema.parse(name)

    const createdLearnsetDeck = await prisma.learnsetDeck.create({
        data: {
            userId,
            name: validatedLearnsetName,
            items: {
                createMany: {
                    data: learnsetDeck.map((learnset, index) => ({
                        pokemonName: learnset.pokemonName,
                        versionGroupName: learnset.versionGroupName,
                        sortOrder: index,
                    }))
                }
            }
        },
        select: {
            id: true,
        },
    })

    return createdLearnsetDeck.id
}

export async function getLearnsetDeckItemDataById(deckId: string): Promise<LearnsetDeckItemData[] | null> {
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

export async function getLearnsetDeckMetadataById(deckId: string): Promise<{ userId: string, name: string } | null> {
    const learnsetDeck = await prisma.learnsetDeck.findUnique({
        where: { id: deckId },
        select: { userId: true, name: true },
    })

    return learnsetDeck ?? null
}