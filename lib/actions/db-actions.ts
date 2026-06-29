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
