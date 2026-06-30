import SearchShell from "@/components/search-shell"
import { getLearnsetDeckUserId, getLearnsetDeckItemDataById } from "@/lib/actions/db-actions"
import { getServerSession } from "@/lib/auth-server"
import { notFound } from "next/navigation"

type DeckPageProps = {
    params: Promise<{ deckId: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
    const { deckId } = await params
    const [ownerId, learnsetDeckItemData, session] = await Promise.all([
        getLearnsetDeckUserId(deckId),
        getLearnsetDeckItemDataById(deckId),
        getServerSession(),
    ])

    if (!learnsetDeckItemData) {
        notFound()
    }

    if (!ownerId) {
        notFound()
    }

    const toolbarType: "owner" | "viewer" =
        ownerId && session?.user?.id === ownerId ? "owner" : "viewer"

    return (
        <main className="container mx-auto p-4 flex-1">
            <SearchShell toolbarType={ toolbarType } learnsetDeckItemData={ learnsetDeckItemData } />
        </main>
    )
}