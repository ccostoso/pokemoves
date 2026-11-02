"use client"

import { SubmitEventHandler, useState } from "react"
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

export default function SearchShell({
    toolbarType = "new",
    learnsetDeckId,
    learnsetDeckItem,
    initialHydratedLearnsets,
    learnsetDeckName,
}: SearchShellProps) {
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
        handleAddLearnsetToLearnsetDeck,
        handleCreateDuplicateLearnsetDeckWithChanges,
        handleCreateDuplicateRevertedLearnsetDeck,
        handleUpdateLearnsetDeck,
        handleRevertChangesToLearnsetDeck,
        handleClearLearnsetsFromDeck,
        handleDeleteLearnsetDeck,
        handleRemoveLearnsetFromDeck,
        handleReorderLearnsetDeck,
    } = useSearchShellController(learnsetDeckItem, learnsetDeckId, initialHydratedLearnsets)

    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(learnsets.length === 0)

    const handleAddAndCollapse: SubmitEventHandler<HTMLFormElement> = async (e) => {
        const wasAdded = await handleAddLearnsetToLearnsetDeck(e)

        setIsSearchPanelOpen(!wasAdded)
    }

    return (
        <>
            <div className="mt-6 flex flex-col gap-6 md:flex-row">
                { (toolbarType === "new" || toolbarType === "owner") && (
                    <aside className="w-full shrink-0 md:w-72">
                        <SearchPanel
                            pokemonList={ pokemonList }
                            versionGroupName={ versionGroupName }
                            setVersionGroupName={ setVersionGroupName }
                            pokemonName={ pokemonName }
                            setPokemonName={ setPokemonName }
                            isSubmitting={ isSubmitting }
                            pokemonListLoading={ pokemonListLoading }
                            error={ error }
                            handleAddLearnsetToLearnsetDeck={ handleAddAndCollapse }
                            open={ isSearchPanelOpen }
                            onOpenChange={ setIsSearchPanelOpen }
                        />
                    </aside>
                ) }
                <section className="flex-1 min-w-0 overflow-x-hidden">
                    <PokemonLearnsetWindow
                        toolbarType={ toolbarType }
                        learnsetDeckId={ learnsetDeckId }
                        learnsets={ learnsets }
                        onClearLearnsetsFromDeck={ handleClearLearnsetsFromDeck }
                        onRemoveLearnsetFromDeck={ handleRemoveLearnsetFromDeck }
                        onReorderLearnsetDeck={ handleReorderLearnsetDeck }
                        onUpdateLearnsetDeck={ handleUpdateLearnsetDeck }
                        onCreateDuplicateLearnsetDeckWithChanges={ handleCreateDuplicateLearnsetDeckWithChanges }
                        onCreateDuplicateRevertedLearnsetDeck={ handleCreateDuplicateRevertedLearnsetDeck }
                        onRevertChangesToLearnsetDeck={ handleRevertChangesToLearnsetDeck }
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
