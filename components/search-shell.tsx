"use client"

import SearchPanel from "./pokemon-search/search-panel"
import { useSearchShellController } from "@/lib/use-search-shell-controller"
import PokemonLearnsetWindow from "./pokemon-learnsets/pokemon-learnset-window"
import { LearnsetDeckItem, LevelUpLearnset } from "@/lib/types"

type SearchShellProps = {
    toolbarType?: "owner" | "viewer" | "new" | "none",
    learnsetDeckId?: string,
    learnsetDeckItem?: LearnsetDeckItem[] | null,
    initialHydratedLearnsets?: LevelUpLearnset[] | null,
    learnsetDeckName?: string | null
}

export default function SearchShell({ toolbarType = "new", learnsetDeckId, learnsetDeckItem, initialHydratedLearnsets, learnsetDeckName }: SearchShellProps) {
    const {
        pokemonList,
        versionGroupName,
        setVersionGroupName,
        pokemonName,
        setPokemonName,
        learnsets,
        error,
        pokemonListLoading,
        isSubmitting,
        hasUnsavedChanges,
        handleAddLearnset,
        handleSaveAsDuplicate,
        handleDuplicateOriginalWithoutSaving,
        handleSaveChanges,
        handleRevertChanges,
        handleClearLearnsets,
        handleDeleteLearnsetDeck,
        handleRemoveLearnset,
        handleReorderLearnset,
    } = useSearchShellController(
        learnsetDeckItem,
        learnsetDeckId,
        initialHydratedLearnsets,
    )

    return (
        <>
            <div className="flex gap-6 mt-6">
                { (toolbarType === "new" || toolbarType === "owner") && 
                    <aside className="w-72 shrink-0">
                        <SearchPanel
                            pokemonList={ pokemonList }
                            versionGroupName={ versionGroupName }
                            setVersionGroupName={ setVersionGroupName }
                            pokemonName={ pokemonName }
                            setPokemonName={ setPokemonName }
                            isSubmitting={ isSubmitting }
                            pokemonListLoading={ pokemonListLoading }
                            error={ error }
                            handleAddLearnset={ handleAddLearnset }
                        />
                    </aside>
                }
                <section className="flex-1 min-w-0 overflow-x-hidden">
                    <PokemonLearnsetWindow
                        toolbarType={ toolbarType }
                        learnsetDeckId={ learnsetDeckId }
                        learnsets={ learnsets }
                        onClearLearnsets={ handleClearLearnsets }
                        onRemoveLearnset={ handleRemoveLearnset }
                        onReorderLearnset={ handleReorderLearnset }
                        onSaveChanges={ handleSaveChanges }
                        onSaveAsDuplicate={ handleSaveAsDuplicate }
                        onDuplicateOriginalWithoutSaving={ handleDuplicateOriginalWithoutSaving }
                        onRevertChanges={ handleRevertChanges }
                        pokemonList={ pokemonList }
                        learnsetDeckName={ learnsetDeckName }
                        isSubmitting={ isSubmitting }
                        hasUnsavedChanges={ hasUnsavedChanges }
                        onDeleteLearnsetDeck={ handleDeleteLearnsetDeck }
                    />
                </section>
            </div>
        </>
    )
}
