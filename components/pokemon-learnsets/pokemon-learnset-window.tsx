import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerLearnsetToolbar, ViewerLearnsetToolbar, NewLearnsetToolbar } from "./toolbars"

type PokemonLearnsetWindowProps = {
    toolbarType: "owner" | "viewer" | "new" | "none",
    learnsetDeckId?: string,
    learnsets: LevelUpLearnset[],
    onClearLearnsets: () => void,
    onRemoveLearnsetFromDeck: (index: number) => void,
    onReorderLearnsetDeck: (fromIndex: number, toIndex: number) => void,
    onUpdateLearnsetDeck: (learnsetName: string) => Promise<string>,
    onCreateDuplicateLearnsetDeckWithChanges: (userId: string, learnsetName: string) => Promise<string>,
    onCreateDuplicateRevertedLearnsetDeck: (userId: string, learnsetName: string) => Promise<string>,
    onRevertChangesToLearnsetDeck: () => void,
    onDeleteLearnsetDeck: () => Promise<void>,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean,
    learnsetDeckName?: string | null,
    hasUnsavedChanges: boolean
}

export default function PokemonLearnsetWindow({
    toolbarType,
    learnsetDeckId,
    learnsets,
    onClearLearnsets,
    onRemoveLearnsetFromDeck,
    onReorderLearnsetDeck,
    onUpdateLearnsetDeck,
    onCreateDuplicateLearnsetDeckWithChanges,
    onCreateDuplicateRevertedLearnsetDeck,
    onRevertChangesToLearnsetDeck,
    onDeleteLearnsetDeck,
    pokemonList,
    isSubmitting,
    learnsetDeckName,
    hasUnsavedChanges,
}: PokemonLearnsetWindowProps) {
    if (toolbarType === "none") {
        return null
    }

    return (
        <div className="flex flex-col border rounded-xl">
            { toolbarType === "owner" && learnsetDeckId && (
                <OwnerLearnsetToolbar
                    learnsetDeckName={ learnsetDeckName }
                    onUpdateLearnsetDeck={ onUpdateLearnsetDeck }
                    onCreateDuplicateLearnsetDeckWithChanges={ onCreateDuplicateLearnsetDeckWithChanges }
                    onCreateDuplicateRevertedLearnsetDeck={ onCreateDuplicateRevertedLearnsetDeck }
                    onRevertChangesToLearnsetDeck={ onRevertChangesToLearnsetDeck }
                    onClearLearnsets={ onClearLearnsets }
                    onDeleteLearnsetDeck={ onDeleteLearnsetDeck }
                    hasUnsavedChanges={ hasUnsavedChanges }
                    learnsetsLength={ learnsets.length }
                />
            ) }
            { toolbarType === "viewer" && (
                <ViewerLearnsetToolbar
                    learnsetDeckName={ learnsetDeckName }
                    onCreateDuplicateLearnsetDeckWithChanges={ onCreateDuplicateLearnsetDeckWithChanges }
                />
            ) }
            { toolbarType === "new" && <NewLearnsetToolbar
                learnsets={ learnsets }
                onClearLearnsets={ onClearLearnsets }
                pokemonList={ pokemonList }
                isSubmitting={ isSubmitting } /> }
            <PokemonLearnsetPanel
                learnsets={ learnsets }
                onRemoveLearnsetFromDeck={ onRemoveLearnsetFromDeck }
                onReorderLearnsetDeck={ onReorderLearnsetDeck }
            />
        </div>
    )
}