import { ComponentProps, ReactNode, forwardRef } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

type NavbarExpandableButtonProps = {
    label: string
    icon: ReactNode
    isActive: boolean
    onActivate: () => void
    expandedWidthClass?: string
} & Omit<ComponentProps<typeof Button>, "children">

const baseClass =
    "group w-8 origin-left overflow-hidden px-0 gap-0 transition-all duration-300"

const NavbarExpandableButton = forwardRef<
    HTMLButtonElement,
    NavbarExpandableButtonProps
>(function NavbarExpandableButton(
    {
        label,
        icon,
        isActive,
        onActivate,
        expandedWidthClass = "w-28",
        className,
        onMouseEnter,
        onFocus,
        ...buttonProps
    },
    ref,
) {
    return (
        <Button
            ref={ref}
            variant="outline"
            size="icon"
            onMouseEnter={(event) => {
                onActivate()
                onMouseEnter?.(event)
            }}
            onFocus={(event) => {
                onActivate()
                onFocus?.(event)
            }}
            className={cn(
                baseClass,
                isActive
                    ? `${expandedWidthClass} px-4 gap-2`
                    : "w-8 px-0 gap-0",
                className,
            )}
            {...buttonProps}
        >
            {icon}
            <span
                className={cn(
                    "max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
                    isActive && "max-w-16",
                )}
            >
                {label}
            </span>
        </Button>
    )
})

export default NavbarExpandableButton
