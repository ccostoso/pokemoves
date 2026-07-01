"use server"

import { prisma } from "@/lib/prisma"
import { LearnsetDeckTitleSchema } from "@/lib/schemas"
import { LearnsetDeckItemData } from "@/lib/types"
import { getServerSession } from "@/lib/auth-server"


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

export async function updateLearnsetDeck(
    deckId: string,
    name: string,
    learnsetDeck: LearnsetDeckItemData[]
): Promise<string> {
    const validatedLearnsetName = LearnsetDeckTitleSchema.parse(name)

    try {
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
    } catch (error) {
        throw error
    }
}