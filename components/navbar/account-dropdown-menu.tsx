"use client"

import { User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import NavbarExpandableButton from "./navbar-expandable-button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

type AccountDropdownMenuProps = {
    activeButton: string | null,
    setActiveButton: (button: string | null) => void,
    isAccountMenuOpen: boolean,
    handleAccountMenuOpenChange: (open: boolean) => void,
    user: {
        name: string | null,
        username: string | null
    } | null
}

export default function AccountDropdownMenu({
    activeButton,
    setActiveButton,
    isAccountMenuOpen,
    handleAccountMenuOpenChange,
    user
}: AccountDropdownMenuProps) {
    const router = useRouter()

    const sessionSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/") // redirect to login page
                },
            },
        })
    }
    return (
        <DropdownMenu onOpenChange={ handleAccountMenuOpenChange }>
            <DropdownMenuTrigger asChild>
                <NavbarExpandableButton
                    label="Account"
                    icon={ <User className="shrink-0 h-5 w-5" /> }
                    isActive={ activeButton === "account" || isAccountMenuOpen }
                    onActivate={ () => setActiveButton("account") }
                    activateOnFocus={ false }
                    expandedWidthClass="w-28"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup className="whitespace-nowrap">
                    <div className="px-1.5 py-1.5">
                        <p className="text-sm font-semibold">
                            @{ user?.username }
                        </p>
                        <p className="text-sm text-muted-foreground">
                            { user?.name }
                        </p>
                    </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>User</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href="/account">Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/account/decks">Decks</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Session</DropdownMenuLabel>
                    <DropdownMenuItem onClick={ sessionSignOut }>
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
