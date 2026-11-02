"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ModeToggleProps = {
    isActive?: boolean,
    onActivate?: () => void,
    onOpenChange?: (open: boolean) => void,
    showLabel?: boolean,
    buttonClassName?: string,
    onSelect?: () => void
}

export function ModeToggle({
    isActive = false,
    onActivate,
    onOpenChange,
    showLabel = false,
    buttonClassName,
    onSelect,
}: ModeToggleProps) {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu onOpenChange={ onOpenChange }>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onPointerEnter={ (event) => {
                        if (event.pointerType === "mouse") {
                            onActivate?.()
                        }
                    } }
                    className={ cn(
                        "group origin-left overflow-hidden px-0 gap-0 transition-all duration-300 size-11",
                        isActive && "[@media(hover:hover)_and_(pointer:fine)]:w-28 [@media(hover:hover)_and_(pointer:fine)]:px-4 [@media(hover:hover)_and_(pointer:fine)]:gap-2",
                        showLabel && "w-full justify-start gap-3 px-3",
                        buttonClassName,
                    ) }
                >
                    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
                        <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 opacity-100 transition-all dark:scale-0 dark:-rotate-90 dark:opacity-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100" />
                    </span>
                    <span
                        className={ cn(
                            showLabel
                                ? "max-w-full overflow-hidden whitespace-nowrap"
                                : cn(
                                    "max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
                                    isActive && "[@media(hover:hover)_and_(pointer:fine)]:max-w-16",
                                ),
                        ) }
                    >
                        Theme
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={ () => { setTheme("light"); onSelect?.() } }>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={ () => { setTheme("dark"); onSelect?.() } }>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={ () => { setTheme("system"); onSelect?.() } }>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
