import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerLearnsetToolbar, ViewerLearnsetToolbar, NewLearnsetToolbar } from "./toolbars"

type PokemonLearnsetWindowProps = {
    toolbarType: "owner" | "viewer" | "new" | "none",
    learnsetDeckId?: string,
    learnsetList: LevelUpLearnset[],
    onClearLearnsets: () => void,
    onRemoveLearnset: (index: number) => void,
    onReorderLearnset: (fromIndex: number, toIndex: number) => void,
    onSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>,
    onSaveChanges: (learnsetName: string) => Promise<string>,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean,
    learnsetDeckName?: string | null,
    hasUnsavedChanges: boolean
}

export default function PokemonLearnsetWindow({
    toolbarType,
    learnsetDeckId,
    learnsetList,
    onClearLearnsets,
    onRemoveLearnset,
    onReorderLearnset,
    onSaveAsDuplicate,
    onSaveChanges,
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
                    hasUnsavedChanges={ hasUnsavedChanges }
                />
            ) }
            { toolbarType === "viewer" && (
                <ViewerLearnsetToolbar
                    learnsetDeckName={ learnsetDeckName }
                    onSaveAsDuplicate={ onSaveAsDuplicate }
                />
            ) }
            { toolbarType === "new" && <NewLearnsetToolbar
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