"use client"

import SearchPanel from "./pokemon-search/search-panel"
import { useSearchShellController } from "@/lib/use-search-shell-controller"
import PokemonLearnsetWindow from "./pokemon-learnsets/pokemon-learnset-window"

type SearchShellProps = {
    toolbarType?: "owner" | "viewer" | "new" | "none"
}

export default function SearchShell({ toolbarType = "new" }: SearchShellProps) {
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
        handleAddLearnset,
        handleClearLearnsets,
        handleRemoveLearnset,
        handleReorderLearnset,
    } = useSearchShellController()

    return (
        <>
            <div className="flex gap-6 mt-6">
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
                <section className="flex-1 min-w-0 overflow-x-hidden">
                    <PokemonLearnsetWindow
                        toolbarType={ toolbarType }
                        learnsetList={ learnsetList }
                        onClearLearnsets={ handleClearLearnsets }
                        onRemoveLearnset={ handleRemoveLearnset }
                        onReorderLearnset={ handleReorderLearnset }
                        pokemonList={ pokemonList }
                        isSubmitting={ isSubmitting }
                    />
                </section>
            </div>
        </>
    )
}
