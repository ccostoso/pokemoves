import SearchPanel from "@/components/pokemon-search/search-panel"
import PokemonMovesPanel from "@/components/table/pokemon-moves-panel"

export default async function Home() {
    return (
        <main className="container mx-auto p-4 flex-1">
            <h1 className="text-4xl font-bold">Pokémon Move Comparison</h1>
            <section id="search" className="mt-8 max-w-2xl mx-auto">
                <SearchPanel />
            </section>
            <section id="results" className="mt-8 overflow-x-auto">
                <PokemonMovesPanel />
            </section>
        </main>
    )
}
