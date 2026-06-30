import SearchShell from "@/components/search-shell"
import { authClient } from "@/lib/auth-client"

export default function DeckPage() {
    const { data: session } = authClient.useSession()

    return (
        <main className="container mx-auto p-4 flex-1">
            <SearchShell />
        </main>
    )
}