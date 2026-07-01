import SearchShell from "@/components/search-shell"
import { getLearnsetDeckMetadataById, getLearnsetDeckItemDataById } from "@/lib/actions/db-actions"
import { getLevelUpMovesByPokemonNameAndVersionGroup } from "@/lib/actions/qraphql-actions"
import { getServerSession } from "@/lib/auth-server"
import { createLearnsetInstanceId, getNextLearnsetOccurrence } from "@/lib/utils"
import { notFound } from "next/navigation"

type DeckPageProps = {
    params: Promise<{ deckId: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
    const { deckId } = await params
    const [learnsetDeckMetadata, learnsetDeckItemData, session] = await Promise.all([
        getLearnsetDeckMetadataById(deckId),
        getLearnsetDeckItemDataById(deckId),
        getServerSession(),
    ])

    if (!learnsetDeckItemData) {
        notFound()
    }

    if (!learnsetDeckMetadata) {
        notFound()
    }

    const toolbarType: "owner" | "viewer" =
        learnsetDeckMetadata.userId && session?.user?.id === learnsetDeckMetadata.userId ? "owner" : "viewer"

    const occurrenceMap = new Map<string, number>()

    const initialHydratedLearnsetList = await Promise.all(
        learnsetDeckItemData.map(async (item) => {
            const pokemonMoves = await getLevelUpMovesByPokemonNameAndVersionGroup(
                item.pokemonName,
                item.versionGroupName,
            )

            const nextOccurrence = getNextLearnsetOccurrence(
                occurrenceMap,
                item.pokemonName,
                item.versionGroupName,
            )

            return {
                ...pokemonMoves,
                id: createLearnsetInstanceId(
                    item.pokemonName,
                    item.versionGroupName,
                    nextOccurrence,
                ),
            }
        }),
    )

    return (
        <main className="container mx-auto p-4 flex-1">
            <SearchShell 
                key={ deckId }
                toolbarType={ toolbarType } 
                learnsetDeckId={ deckId }
                learnsetDeckItemData={ learnsetDeckItemData }
                initialHydratedLearnsetList={ initialHydratedLearnsetList }
                learnsetDeckName={ learnsetDeckMetadata.name } 
            />
        </main>
    )
}