"use client"

import SearchPanel from "./pokemon-search/search-panel"
import PokemonMovesetPanel from "./pokemon-movesets/pokemon-moveset-panel"
import { useSearchShellController } from "@/lib/use-search-shell-controller"

export default function SearchShell() {
    const {
        pokemonList,
        versionGroupName,
        setVersionGroupName,
        pokemonName,
        setPokemonName,
        resultArr,
        error,
        isSubmitting,
        handleSubmit,
        handleRemoveResult,
        handleReorderResult,
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
                <section className="flex-1 overflow-x-auto ">
                    <PokemonMovesetPanel
                        resultArr={resultArr}
                        onRemoveResult={handleRemoveResult}
                        onReorderResult={handleReorderResult}
                    />
                </section>
            </div>
        </>
    )
}
