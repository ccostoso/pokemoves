import SearchShell from "@/components/search-shell"

export default async function Home() {
    return (
        <main className="container mx-auto p-4 flex-1">
            <h1 className="text-4xl font-bold">Pokémon Move Comparison</h1>
            <SearchShell />
        </main>
    )
}
