import { getServerSession } from "@/lib/auth-server"
import NameChangeForm from "./components/name-change-form"
import EmailChangeForm from "./components/email-change-form"
import PasswordChangeForm from "./components/password-change-form"
import { notFound } from "next/navigation"
import DeleteAccountForm from "./components/delete-account-form"
import { Separator } from "@/components/ui/separator"


export default async function UserPage() {
    let session: Awaited<ReturnType<typeof getServerSession>> | null = null

    try {
        session = await getServerSession()
    } catch (error) {
        console.error("Error fetching session:", error)
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
            <NameChangeForm name={ user.name ?? "" } />
            <EmailChangeForm email={ user.email } />
            <PasswordChangeForm />
            <Separator className="my-8" />
            <h1 className="text-4xl font-bold text-destructive">Danger Zone</h1>
            <DeleteAccountForm />
        </main>
    )
}
