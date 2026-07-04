import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerLearnsetToolbar, ViewerLearnsetToolbar, NewLearnsetToolbar } from "./toolbars"

type PokemonLearnsetWindowProps = {
    toolbarType: "owner" | "viewer" | "new" | "none",
    learnsetDeckId?: string,
    learnsets: LevelUpLearnset[],
    onClearLearnsets: () => void,
    onRemoveLearnset: (index: number) => void,
    onReorderLearnset: (fromIndex: number, toIndex: number) => void,
    onUpdateLearnsetDeck: (learnsetName: string) => Promise<string>,
    onSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>,
    onDuplicateOriginalWithoutSaving: (userId: string, learnsetName: string) => Promise<string>,
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
    onRemoveLearnset,
    onReorderLearnset,
    onUpdateLearnsetDeck,
    onSaveAsDuplicate,
    onDuplicateOriginalWithoutSaving,
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
                    onSaveAsDuplicate={ onSaveAsDuplicate }
                    onDuplicateOriginalWithoutSaving={ onDuplicateOriginalWithoutSaving }
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
                    onSaveAsDuplicate={ onSaveAsDuplicate }
                />
            ) }
            { toolbarType === "new" && <NewLearnsetToolbar
                learnsets={ learnsets }
                onClearLearnsets={ onClearLearnsets }
                pokemonList={ pokemonList }
                isSubmitting={ isSubmitting } /> }
            <PokemonLearnsetPanel
                learnsets={ learnsets }
                onRemoveLearnset={ onRemoveLearnset }
                onReorderLearnset={ onReorderLearnset }
            />
        </div>
    )
}