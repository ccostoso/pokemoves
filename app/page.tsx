import SearchPanel from "@/components/pokemon-search/search-panel"
import PokemonTable from "@/components/table/pokemon-table"

export default async function Home() {
    async function getExternalData() {
        const apiKey = process.env.EXTERNAL_API_KEY // Safe from client exposure

        const response = await fetch("https://example.com", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            // Next.js specific caching options:
            next: { revalidate: 3600 }, // Cache data for 1 hour (3600 seconds)
        })

        if (!response.ok) {
            throw new Error("Failed to fetch external API data")
        }

        return response.json()
    }

    return (
        <main className="container mx-auto p-4 flex-1">
            <h1 className="text-4xl font-bold">Pokémon Move Comparison</h1>
            <section id="search" className="mt-8 max-w-2xl mx-auto">
                <SearchPanel />
            </section>
            <section id="results" className="mt-8 overflow-x-auto">
                <PokemonTable />
            </section>
        </main>
    )
}
