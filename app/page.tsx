import SearchShell from "@/components/search-shell"

export default async function Home() {
    return (
        <main className="container mx-auto p-4 flex-1">
            <SearchShell toolbarType="new" />
        </main>
    )
}
