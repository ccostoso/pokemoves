import SearchPanel from "@/components/pokemon-search/search-panel"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
                <div className="flex flex-nowrap justify-center gap-4 pb-2">
                    <div className="basis-1/4 shrink-0 min-w-72">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        colSpan={2}
                                        className="text-center"
                                    >
                                        Version
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead
                                        colSpan={2}
                                        className="text-center"
                                    >
                                        Name
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Level
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Move
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Electric</TableCell>
                                    <TableCell>Static, Lightning Rod</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Grass/Poison</TableCell>
                                    <TableCell>Overgrow, Chlorophyll</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </section>
        </main>
    )
}
