"use client"

import { authClient } from "@/lib/auth-client"

export default function UserPage() {
    // TODO: Add a JSON.stringify() of the user session data here for debugging purposes. This will help us see what data is available in the session and how we can use it to display user-specific information on the dashboard.
    const { data: session, isPending, error } = authClient.useSession()

    if (isPending) {
        return (
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-4xl font-bold">User Dashboard</h1>
                <p className="mt-4 text-lg">Loading your session data...</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-4xl font-bold">User Dashboard</h1>
                <p className="mt-4 text-lg text-red-500">
                    Error loading session data: {error.message}
                </p>
            </main>
        )
    }

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
                Welcome to your dashboard! Here you can manage your account and
                view your Pokémon move comparisons.
            </p>
        </main>
    )
}
