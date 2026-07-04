import { getServerSession } from "@/lib/auth-server"
import UsernameEmailForm from "./components/username-email-form"


export default async function UserPage() {
    let session: Awaited<ReturnType<typeof getServerSession>> | null = null
    let authFailed = false
    try {
        session = await getServerSession()
    } catch (error) {
        authFailed = true
    }

    if (!session?.user) {
        return (
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-4xl font-bold">User Dashboard</h1>
                <p className="mt-4 text-lg">You are not signed in. Please sign in to access your dashboard.</p>
                { authFailed && (
                    <p className="mt-2 text-lg text-red-500">Error retrieving session data. Please try again.</p>
                ) }
            </main>
        )
    }

    const { user } = session

    return (
        <main className="container mx-auto p-4 flex-1">
            <h1 className="text-4xl font-bold">User Dashboard</h1>
            <UsernameEmailForm username={ user.name } email={ user.email } />
            <pre>{ JSON.stringify(session, null, 2) }</pre>
        </main>
    )
}
