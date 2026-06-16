"use client"

import { CircleQuestionMark, Pencil, User } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
import { cn } from "@/lib/utils"

export default function Navbar() {
    const [activeButton, setActiveButton] = useState<string | null>(null)
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)

    const expandableButtonBaseClass =
        "group w-8 origin-left overflow-hidden px-0 gap-0 transition-all duration-300"

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
                <div className="text-xl font-bold">Pokémoves</div>
                <div className="flex items-center gap-3 md:gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onMouseEnter={() => setActiveButton("account")}
                        onFocus={() => setActiveButton("account")}
                        className={cn(
                            expandableButtonBaseClass,
                            activeButton === "account"
                                ? "w-28 px-4 gap-2"
                                : "w-8 px-0 gap-0",
                        )}
                    >
                        <User className="h-5 w-5 shrink-0" />
                        <span
                            className={cn(
                                "max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
                                activeButton === "account" && "max-w-16",
                            )}
                        >
                            Account
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onMouseEnter={() => setActiveButton("about")}
                        onFocus={() => setActiveButton("about")}
                        className={cn(
                            expandableButtonBaseClass,
                            activeButton === "about"
                                ? "w-24 px-4 gap-2"
                                : "w-8 px-0 gap-0",
                        )}
                    >
                        <CircleQuestionMark className="h-5 w-5 shrink-0" />
                        <span
                            className={cn(
                                "max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
                                activeButton === "about" && "max-w-16",
                            )}
                        >
                            About
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onMouseEnter={() => setActiveButton("contact")}
                        onFocus={() => setActiveButton("contact")}
                        className={cn(
                            expandableButtonBaseClass,
                            activeButton === "contact"
                                ? "w-28 px-4 gap-2"
                                : "w-8 px-0 gap-0",
                        )}
                    >
                        <Pencil className="h-5 w-5 shrink-0" />
                        <span
                            className={cn(
                                "max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
                                activeButton === "contact" && "max-w-16",
                            )}
                        >
                            Contact
                        </span>
                    </Button>
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
                </div>
            </div>
        </nav>
    )
}
