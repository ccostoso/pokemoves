import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerLearnsetToolbar, ViewerLearnsetToolbar, NewLearnsetToolbar } from "./toolbars"
import { useParams, usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { getLearnsetDeckById } from "@/lib/actions/db-actions"

type PokemonLearnsetWindowProps = {
    learnsetList: LevelUpLearnset[],
    onClearLearnsets: () => void,
    onRemoveLearnset: (index: number) => void,
    onReorderLearnset: (fromIndex: number, toIndex: number) => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
    
}

export default function PokemonLearnsetWindow({
    learnsetList,
    onClearLearnsets,
    onRemoveLearnset,
    onReorderLearnset,
    pokemonList,
    isSubmitting
}: PokemonLearnsetWindowProps) {
    // ...existing code...
    const path = usePathname()
    const { deckId } = useParams<{ deckId?: string }>()
    const { data: session } = authClient.useSession()

    const isDeckRoute = path.startsWith("/deck/")

    let isOwner = false
    let TOOLBAR_TYPE: "owner" | "viewer" | "new" | "none"

    if (path === "/") {
        TOOLBAR_TYPE = "new"
    } else if (isDeckRoute && deckId) {
        isOwner = session?.user?.id === "owner-id" // replace with real owner check
        TOOLBAR_TYPE = isOwner ? "owner" : "viewer"
    } else {
        TOOLBAR_TYPE = "none"
    }
    // ...existing code...
    if (TOOLBAR_TYPE === "none") {
        return null
    }

    return (
        <div className="flex flex-col border rounded-xl">
            { TOOLBAR_TYPE === "owner" && <OwnerLearnsetToolbar /> }
            { TOOLBAR_TYPE === "viewer" && <ViewerLearnsetToolbar /> }
            { TOOLBAR_TYPE === "new" && <NewLearnsetToolbar
                learnsetList={ learnsetList }
                handleClearLearnsets={ onClearLearnsets }
                pokemonList={ pokemonList }
                isSubmitting={ isSubmitting } /> }
            <PokemonLearnsetPanel
                learnsetList={ learnsetList }
                onRemoveLearnset={ onRemoveLearnset }
                onReorderLearnset={ onReorderLearnset }
            />
        </div>
    )
}