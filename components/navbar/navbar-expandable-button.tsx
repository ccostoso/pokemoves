import { ComponentProps, ReactNode } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

type NavbarExpandableButtonProps = {
    label: string,
    icon: ReactNode,
    isActive: boolean,
    onActivate: () => void,
    activateOnFocus?: boolean,
    expandedWidthClass?: string
} & Omit<ComponentProps<typeof Button>, "children">

const baseClass =
    "group w-8 origin-left overflow-hidden px-0 gap-0 transition-all duration-300"

export default function NavbarExpandableButton({
    label,
    icon,
    isActive,
    onActivate,
    activateOnFocus = true,
    expandedWidthClass = "w-28",
    className,
    onMouseEnter,
    onFocus,
    ref,
    ...buttonProps
}: NavbarExpandableButtonProps) {
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
                if (activateOnFocus) {
                    onActivate()
                }

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
}
