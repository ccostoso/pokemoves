"use client"

import { CircleQuestionMark, Pencil, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import SignInDialog from "./sign-in-dialog"
import { authClient } from "@/lib/auth-client"
import NavbarExpandableButton from "./navbar-expandable-button"
import Link from "next/link"

export default function Navbar() {
    const router = useRouter()
    const [activeButton, setActiveButton] = useState<string | null>(null)
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
    const [isSignInOpen, setIsSignInOpen] = useState(false)
    const { data: session, isPending } = authClient.useSession()

    const handleAccountClick = () => {
        if (isPending) {
            return
        }

        if (session?.user) {
            router.push("/user/")
            return
        }

        setIsSignInOpen(true)
    }

    const handleSignInOpenChange = (open: boolean) => {
        setIsSignInOpen(open)

        if (!open && !isThemeMenuOpen) {
            setActiveButton(null)
        }
    }

    return (
        <nav
            className="bg-background text-foreground p-4 border-b border-foreground/20"
            onMouseLeave={() => {
                if (!isThemeMenuOpen) {
                    setActiveButton(null)
                }
            }}
        >
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="text-xl font-bold">
                    <Link href="/">Pokémoves</Link>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <NavbarExpandableButton
                        label="Account"
                        icon={<User className="shrink-0 h-5 w-5" />}
                        isActive={activeButton === "account"}
                        onActivate={() => setActiveButton("account")}
                        onClick={handleAccountClick}
                        expandedWidthClass="w-28"
                    />
                    <NavbarExpandableButton
                        label="About"
                        icon={
                            <CircleQuestionMark className="shrink-0 h-5 w-5" />
                        }
                        isActive={activeButton === "about"}
                        onActivate={() => setActiveButton("about")}
                        expandedWidthClass="w-24"
                    />
                    <NavbarExpandableButton
                        label="Contact"
                        icon={<Pencil className="shrink-0 h-5 w-5" />}
                        isActive={activeButton === "contact"}
                        onActivate={() => setActiveButton("contact")}
                        expandedWidthClass="w-28"
                    />
                    <ModeToggle
                        isActive={activeButton === "theme" || isThemeMenuOpen}
                        onActivate={() => setActiveButton("theme")}
                        onOpenChange={(open) => {
                            setIsThemeMenuOpen(open)

                            if (open) {
                                setActiveButton("theme")
                                return
                            }

                            setActiveButton(null)
                        }}
                    />
                    <SignInDialog
                        open={isSignInOpen}
                        onOpenChange={handleSignInOpenChange}
                    />
                </div>
            </div>
        </nav>
    )
}
