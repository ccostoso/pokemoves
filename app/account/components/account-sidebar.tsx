"use client"

import { cn } from "@/lib/utils"
import { Columns3, User } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"

function SidebarNavLink({
    href,
    icon,
    children,
    isActive,
}: {
    href: string,
    icon: ReactNode,
    children: ReactNode,
    isActive?: boolean
}) {
    return (
        <div className="relative">
            { isActive && <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-foreground" /> }
            <Link
                href={ href }
                className={ cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground",
                ) }
            >
                { icon }
                { children }
            </Link>
        </div>
    )
}

const SidebarOptions: { href: string, icon: ReactNode, label: string }[] = [
    {
        href: "/account",
        icon: <User size={ 16 } />,
        label: "Settings",
    },
    {
        href: "/account/decks",
        icon: <Columns3 size={ 16 } />,
        label: "Decks",
    },
]

export default function AccountSidebar() {
    const pathname = usePathname()
    const { data: session } = authClient.useSession()

    return (
        <aside className="w-56 shrink-0 self-stretch p-4 flex flex-col gap-4">
            <div className="px-2">
                <p className="text-sm font-semibold">@{ session?.user?.username }</p>
                <p className="text-muted-foreground">{ session?.user?.name }</p>
            </div>

            <nav className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Pages
                    </p>
                    { SidebarOptions.map((option) => (
                        <SidebarNavLink
                            key={ option.href }
                            href={ option.href }
                            icon={ option.icon }
                            isActive={ pathname === option.href }
                        >
                            { option.label }
                        </SidebarNavLink>
                    )) }
                </div>
            </nav>
        </aside>
    )
}
