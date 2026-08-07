import AccountSidebar from "@/app/account/components/account-sidebar"
import { getServerSession } from "@/lib/auth/auth-server"

export const dynamic = 'force-dynamic'

export default async function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await getServerSession()

    return (
        <main className="container mx-auto p-4 flex-1 flex flex-row gap-4 items-stretch">
            <AccountSidebar
                initialUser={
                    session?.user
                        ? {
                            name: session.user.name ?? null,
                            username: session.user.username ?? null,
                        }
                        : null
                }
            />
            { children }
        </main>
    )
}
