"use client"

import { cn } from "@/lib/utils"
import { Columns3, User } from "lucide-react"
import Link from "next/link"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"

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
        <div className="relative max-md:shrink-0">
            { isActive && (
                <span className="absolute max-md:inset-x-3 max-md:bottom-0 max-md:h-0.5 md:-left-1.5 md:top-1/2 md:-translate-y-1/2 md:w-0.5 md:h-6 bg-foreground" />
            ) }
            <Link
                href={ href }
                aria-current={ isActive ? "page" : undefined }
                className={ cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm max-md:min-h-11 max-md:px-4 max-md:whitespace-nowrap",
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

type AccountSidebarUser = {
    name: string | null,
    username: string | null
}

type AccountSidebarProps = {
    initialUser: AccountSidebarUser | null
}

export default function AccountSidebar({ initialUser }: AccountSidebarProps) {
    const pathname = usePathname()
    const { data: session, isPending } = authClient.useSession()
    const scrollerRef = useRef<HTMLDivElement>(null)
    const [showLeftFade, setShowLeftFade] = useState(false)
    const [showRightFade, setShowRightFade] = useState(false)

    const updateFadeVisibility = useCallback(() => {
        const scroller = scrollerRef.current

        if (!scroller) {
            return
        }

        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth

        setShowLeftFade(scroller.scrollLeft > 2)
        setShowRightFade(maxScrollLeft - scroller.scrollLeft > 2)
    }, [])

    useEffect(() => {
        const scroller = scrollerRef.current

        if (!scroller) {
            return
        }

        updateFadeVisibility()

        const resizeObserver = new ResizeObserver(updateFadeVisibility)

        resizeObserver.observe(scroller)
        scroller.addEventListener("scroll", updateFadeVisibility, { passive: true })

        return () => {
            resizeObserver.disconnect()
            scroller.removeEventListener("scroll", updateFadeVisibility)
        }
    }, [updateFadeVisibility])

    // Keep the active tab visible in the horizontally scrolling tab bar.
    // Scrolls the bar itself rather than using scrollIntoView, which could also scroll the page.
    useEffect(() => {
        const scroller = scrollerRef.current
        const activeLink = scroller?.querySelector<HTMLElement>("[aria-current='page']")

        if (!scroller || !activeLink) {
            return
        }

        const target = activeLink.offsetLeft - (scroller.clientWidth - activeLink.offsetWidth) / 2

        scroller.scrollTo({ left: Math.max(0, target) })
    }, [pathname])

    // Use server-provided user only while client session status is still pending.
    // Once resolved, trust client session state (including logged-out/null).
    const effectiveUser: AccountSidebarUser | null = isPending
        ? initialUser
        : session?.user
            ? {
                name: session.user.name ?? null,
                username: session.user.username ?? null,
            }
            : null

    return (
        <aside className="w-full md:w-56 md:shrink-0 md:self-stretch md:p-4 flex flex-col gap-3 md:gap-4">
            <div className="px-2 max-md:flex max-md:items-baseline max-md:gap-2">
                <p className="text-sm font-semibold">@{ effectiveUser?.username }</p>
                <p className="text-muted-foreground">{ effectiveUser?.name }</p>
            </div>

            <nav className="relative flex min-w-0 flex-col gap-4">
                <div
                    ref={ scrollerRef }
                    className="relative flex flex-col gap-1 max-md:flex-row max-md:gap-0 max-md:overflow-x-auto max-md:border-b"
                >
                    <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 max-md:hidden">
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
                { showLeftFade && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-background to-transparent md:hidden" />
                ) }
                { showRightFade && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent md:hidden" />
                ) }
            </nav>
        </aside>
    )
}
