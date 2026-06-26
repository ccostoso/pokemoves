import { getServerSession } from "@/lib/auth-server"

export default async function UserPage() {
    try {
        const session = await getServerSession()

        if (!session?.user) {
            return (
                <main className="container mx-auto p-4 flex-1">
                    <h1 className="text-4xl font-bold">User Dashboard</h1>
                    <p className="mt-4 text-lg">
                        You are not signed in. Please sign in to access your
                        dashboard.
                    </p>
                </main>
            )
        }

        return (
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-4xl font-bold">User Dashboard</h1>

                <pre>{JSON.stringify(session, null, 2)}</pre>

                <p className="mt-4 text-lg">
                    Welcome to your dashboard! Here you can manage your account
                    and view your Pokemon move comparisons.
                </p>
            </main>
        )
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error"

        return (
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-4xl font-bold">User Dashboard</h1>
                <p className="mt-4 text-lg text-red-500">
                    Error loading session data: {errorMessage}
                </p>
            </main>
        )
    }
}
