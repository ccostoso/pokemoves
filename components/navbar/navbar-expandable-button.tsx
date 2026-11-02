import { ComponentProps, ReactNode } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

type NavbarExpandableButtonProps = {
    label: string,
    icon: ReactNode,
    isActive: boolean,
    onActivate: () => void,
    activateOnFocus?: boolean,
    showLabel?: boolean,
    expandedWidthClass?: "w-24" | "w-28",
    href?: string
} & Omit<ComponentProps<typeof Button>, "children">

const baseClass = "group origin-left overflow-hidden px-0 gap-0 transition-all duration-300"

export default function NavbarExpandableButton({
    label,
    icon,
    isActive,
    onActivate,
    activateOnFocus = true,
    showLabel = false,
    expandedWidthClass = "w-28",
    href,
    className,
    onPointerEnter,
    onFocus,
    ref,
    ...buttonProps
}: NavbarExpandableButtonProps) {
    const content = (
        <>
            { icon }
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
                { label }
            </span>
        </>
    )
    const expandedWidth = expandedWidthClass === "w-24"
        ? "[@media(hover:hover)_and_(pointer:fine)]:w-24"
        : "[@media(hover:hover)_and_(pointer:fine)]:w-28"

    return (
        <Button
            ref={ ref }
            variant="outline"
            size="icon"
            asChild={ Boolean(href) }
            onPointerEnter={ (event) => {
                if (event.pointerType === "mouse") {
                    onActivate()
                }

                onPointerEnter?.(event)
            } }
            onFocus={ (event) => {
                if (activateOnFocus) {
                    onActivate()
                }

                onFocus?.(event)
            } }
            className={ cn(
                baseClass,
                "size-11",
                isActive && `${expandedWidth} [@media(hover:hover)_and_(pointer:fine)]:px-4 [@media(hover:hover)_and_(pointer:fine)]:gap-2`,
                className,
            ) }
            { ...buttonProps }
        >
            { href ? (
                <a href={ href } target="_blank" rel="noopener noreferrer">
                    { content }
                </a>
            ) : content }
        </Button>
    )
}
