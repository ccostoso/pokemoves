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
    onSaveChanges: (learnsetName: string) => Promise<string>,
    onSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>,
    onDuplicateOriginalWithoutSaving: (userId: string, learnsetName: string) => Promise<string>,
    onRevertChanges: () => void,
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
    onSaveChanges,
    onSaveAsDuplicate,
    onDuplicateOriginalWithoutSaving,
    onRevertChanges,
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
                    onSaveChanges={ onSaveChanges }
                    onSaveAsDuplicate={ onSaveAsDuplicate }
                    onDuplicateOriginalWithoutSaving={ onDuplicateOriginalWithoutSaving }
                    onRevertChanges={ onRevertChanges }
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