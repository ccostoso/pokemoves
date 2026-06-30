import SearchShell from "@/components/search-shell"
import { getLearnsetDeckMetadata, getLearnsetDeckItemDataById } from "@/lib/actions/db-actions"
import { getServerSession } from "@/lib/auth-server"
import { notFound } from "next/navigation"

type DeckPageProps = {
    params: Promise<{ deckId: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
    const { deckId } = await params
    const [learnsetDeckMetadata, learnsetDeckItemData, session] = await Promise.all([
        getLearnsetDeckMetadata(deckId),
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

    return (
        <main className="container mx-auto p-4 flex-1">
            <SearchShell 
                toolbarType={ toolbarType } 
                learnsetDeckItemData={ learnsetDeckItemData }
                learnsetDeckName={ learnsetDeckMetadata.name } 
            />
        </main>
    )
}