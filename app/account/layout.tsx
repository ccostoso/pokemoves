import AccountSidebar from "@/app/account/components/account-sidebar"


export default function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="container mx-auto p-4 flex-1 flex flex-row gap-4 items-stretch">
            <AccountSidebar />
            { children }
        </main>
    )
}