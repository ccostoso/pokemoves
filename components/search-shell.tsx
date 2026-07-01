"use client"

import SearchPanel from "./pokemon-search/search-panel"
import { useSearchShellController } from "@/lib/use-search-shell-controller"
import PokemonLearnsetWindow from "./pokemon-learnsets/pokemon-learnset-window"
import { LearnsetDeckItemData, LevelUpLearnset } from "@/lib/types"

type SearchShellProps = {
    toolbarType?: "owner" | "viewer" | "new" | "none",
    learnsetDeckId?: string,
    learnsetDeckItemData?: LearnsetDeckItemData[] | null,
    initialHydratedLearnsetList?: LevelUpLearnset[] | null,
    learnsetDeckName?: string | null
}

export default function SearchShell({ toolbarType = "new", learnsetDeckId, learnsetDeckItemData, initialHydratedLearnsetList, learnsetDeckName }: SearchShellProps) {
    const {
        pokemonList,
        versionGroupName,
        setVersionGroupName,
        pokemonName,
        setPokemonName,
        learnsetList,
        error,
        pokemonListLoading,
        isSubmitting,
        hasUnsavedChanges,
        handleAddLearnset,
        handleSaveAsDuplicate,
        handleClearLearnsets,
        handleRemoveLearnset,
        handleReorderLearnset,
    } = useSearchShellController(
        learnsetDeckItemData,
        learnsetDeckId,
        initialHydratedLearnsetList,
    )

    return (
        <>
            <div className="flex gap-6 mt-6">
                { toolbarType !== "viewer" && 
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
                        learnsetList={ learnsetList }
                        onClearLearnsets={ handleClearLearnsets }
                        onRemoveLearnset={ handleRemoveLearnset }
                        onReorderLearnset={ handleReorderLearnset }
                        onSaveAsDuplicate={ handleSaveAsDuplicate }
                        pokemonList={ pokemonList }
                        learnsetDeckName={ learnsetDeckName }
                        isSubmitting={ isSubmitting }
                        hasUnsavedChanges={ hasUnsavedChanges }
                    />
                </section>
            </div>
        </>
    )
}
