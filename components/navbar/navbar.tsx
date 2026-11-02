"use client"

import { Menu, Pencil, User, X } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import SignInDialog from "./sign-in-dialog"
import { authClient } from "@/lib/auth/auth-client"
import NavbarExpandableButton from "./navbar-expandable-button"
import Link from "next/link"
import AccountDropdownMenu from "./account-dropdown-menu"
import AboutDialog from "../about/about-dialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const mobileMenuButtonClassName = "min-h-11 w-full justify-start gap-3 px-3"

type NavbarUser = {
    name: string | null,
    username: string | null
}

type NavbarProps = {
    initialUser: NavbarUser | null
}

export default function Navbar({ initialUser }: NavbarProps) {
    const [activeButton, setActiveButton] = useState<string | null>(null)
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
    const [isSignInOpen, setIsSignInOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { data: session, isPending } = authClient.useSession()

    // Use server-provided user only while client session status is still pending.
    // Once resolved, trust client session state (including logged-out/null).
    const effectiveUser: NavbarUser | null = isPending
        ? initialUser
        : session?.user
            ? {
                name: session.user.name ?? null,
                username: session.user.username ?? null,
            }
            : null

    // Check if there is a session user
    const hasSessionUser = Boolean(effectiveUser)

    // Handle the account button click
    const handleAccountClick = () => {
        if (isPending) {
            return
        }

        if (hasSessionUser) {
            return
        }

        setIsSignInOpen(true)
    }

    const handleAccountMenuOpenChange = (open: boolean) => {
        setIsAccountMenuOpen(open)

        if (open) {
            setActiveButton("account")
            return
        }

        if (!isThemeMenuOpen) {
            setActiveButton(null)
        }
    }

    const handleSignInOpenChange = (open: boolean) => {
        setIsSignInOpen(open)

        if (!open && !isThemeMenuOpen) {
            setActiveButton(null)
        }
    }

    return (
        <nav
            className="bg-background text-foreground p-2 sm:p-4 border-b border-foreground/20"
            onMouseLeave={ () => {
                if (!isThemeMenuOpen && !isAccountMenuOpen) {
                    setActiveButton(null)
                }
            } }
        >
            <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
                <div className="text-xl font-bold">
                    <Link href="/" className="flex min-h-11 items-center">Pokémoves</Link>
                </div>
                <div className="hidden items-center gap-3 md:flex">
                    { hasSessionUser ? (
                        <AccountDropdownMenu
                            activeButton={ activeButton }
                            setActiveButton={ setActiveButton }
                            isAccountMenuOpen={ isAccountMenuOpen }
                            handleAccountMenuOpenChange={ handleAccountMenuOpenChange }
                            user={ effectiveUser }
                        />
                    ) : (
                        <NavbarExpandableButton
                            label="Account"
                            icon={ <User className="shrink-0 h-5 w-5" /> }
                            isActive={ activeButton === "account" }
                            onActivate={ () => setActiveButton("account") }
                            onClick={ handleAccountClick }
                            expandedWidthClass="w-28"
                        />
                    ) }

                    <AboutDialog
                        activeButton={ activeButton }
                        setActiveButton={ setActiveButton }
                    />

                    <NavbarExpandableButton
                        label="Contact"
                        icon={ <Pencil className="shrink-0 h-5 w-5" /> }
                        isActive={ activeButton === "contact" }
                        onActivate={ () => setActiveButton("contact") }
                        expandedWidthClass="w-28"
                        href="https://costo.so/contact"
                    />

                    <ModeToggle
                        isActive={ activeButton === "theme" || isThemeMenuOpen }
                        onActivate={ () => setActiveButton("theme") }
                        onOpenChange={ (open) => {
                            setIsThemeMenuOpen(open)

                            if (open) {
                                setActiveButton("theme")
                                return
                            }

                            setActiveButton(null)
                        } }
                    />
                    <SignInDialog open={ isSignInOpen } onOpenChange={ handleSignInOpenChange } />
                </div>

                <div className="md:hidden">
                    <Sheet open={ isMobileMenuOpen } onOpenChange={ setIsMobileMenuOpen }>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="size-11" aria-label="Open menu">
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" showCloseButton={ false } className="gap-3 px-4 pb-4 pt-5">
                            <SheetHeader className="p-0 pr-12">
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <SheetClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-3 top-2 size-11"
                                    aria-label="Close menu"
                                >
                                    <X className="size-5" />
                                </Button>
                            </SheetClose>
                            <div className="flex flex-col gap-2">
                                { hasSessionUser ? (
                                    <AccountDropdownMenu
                                        activeButton={ activeButton }
                                        setActiveButton={ setActiveButton }
                                        isAccountMenuOpen={ isAccountMenuOpen }
                                        handleAccountMenuOpenChange={ handleAccountMenuOpenChange }
                                        showLabel
                                        buttonClassName={ mobileMenuButtonClassName }
                                        onAction={ () => setIsMobileMenuOpen(false) }
                                        user={ effectiveUser }
                                    />
                                ) : (
                                    <SheetClose asChild>
                                        <Button
                                            variant="outline"
                                            className={ mobileMenuButtonClassName }
                                            onClick={ handleAccountClick }
                                        >
                                            <User className="size-5" />
                                            Account
                                        </Button>
                                    </SheetClose>
                                ) }

                                <AboutDialog
                                    activeButton={ activeButton }
                                    setActiveButton={ setActiveButton }
                                    showLabel
                                    buttonClassName={ mobileMenuButtonClassName }
                                    onTriggerClick={ () => setIsMobileMenuOpen(false) }
                                />

                                <Button
                                    variant="outline"
                                    asChild
                                    className={ mobileMenuButtonClassName }
                                >
                                    <a
                                        href="https://costo.so/contact"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={ () => setIsMobileMenuOpen(false) }
                                    >
                                        <Pencil className="size-5" />
                                        Contact
                                    </a>
                                </Button>

                                <ModeToggle
                                    showLabel
                                    buttonClassName={ mobileMenuButtonClassName }
                                    onSelect={ () => setIsMobileMenuOpen(false) }
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
