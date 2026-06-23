"use client"

import SearchPanel from "./pokemon-search/search-panel"
import PokemonLearnsetPanel from "./pokemon-learnsets/pokemon-learnset-panel"
import { useSearchShellController } from "@/lib/use-search-shell-controller"

export default function SearchShell() {
    const {
        pokemonList,
        versionGroupName,
        setVersionGroupName,
        pokemonName,
        setPokemonName,
        learnsetList,
        error,
        isSubmitting,
        handleSubmit,
        handleRemoveLearnset,
        handleReorderLearnset,
    } = useSearchShellController()

    return (
        <>
            <div className="flex gap-6 mt-6">
                <aside className="w-72 shrink-0">
                    <SearchPanel
                        pokemonList={pokemonList}
                        versionGroupName={versionGroupName}
                        setVersionGroupName={setVersionGroupName}
                        pokemonName={pokemonName}
                        setPokemonName={setPokemonName}
                        isSubmitting={isSubmitting}
                        error={error}
                        handleSubmit={handleSubmit}
                    />
                </aside>
                <section className="flex-1 min-w-0 overflow-x-hidden">
                    <PokemonLearnsetPanel
                        learnsetList={learnsetList}
                        onRemoveLearnset={handleRemoveLearnset}
                        onReorderLearnset={handleReorderLearnset}
                    />
                </section>
            </div>
        </>
    )
}
