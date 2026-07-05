import { getServerSession } from "@/lib/auth-server"
import UsernameEmailForm from "./components/username-email-form"
import PasswordChangeForm from "./components/password-change-form"
import { notFound } from "next/navigation"


export default async function UserPage() {
    let session: Awaited<ReturnType<typeof getServerSession>> | null = null
    let authFailed = false
    try {
        session = await getServerSession()
    } catch (error) {
        authFailed = true
    }

    if (!session?.user) {
        notFound() 
    }

    const { user } = session

    if (!user.username || !user.email) {
        notFound()
    }

    return (
        <main className="container mx-auto p-4 flex-1">
            <h1 className="text-4xl font-bold">User Dashboard</h1>
            <UsernameEmailForm name={ user?.name } email={ user.email } />
            <PasswordChangeForm />
            <pre>{ JSON.stringify(session, null, 2) }</pre>
        </main>
    )
}
