"use client"

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { ReactNode, useId, useState } from "react"

type ToolbarActionsProps = {
    children: ReactNode,
    label?: string
}

export function ToolbarActions({ children, label = "Deck actions" }: ToolbarActionsProps) {
    const [open, setOpen] = useState(false)
    const contentId = useId()

    return (
        <Collapsible open={ open } onOpenChange={ setOpen } className="w-full">
            <CollapsibleTrigger asChild>
                <button
                    type="button"
                    aria-controls={ contentId }
                    className="group/trigger flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border px-3 text-left text-sm font-medium md:hidden"
                >
                    { label }
                    <ChevronDown className="size-5 shrink-0 transition-transform group-data-[state=open]/trigger:rotate-180" />
                </button>
            </CollapsibleTrigger>
            { /* Plain div instead of CollapsibleContent: Radix unmounts children while closed, but the actions must stay visible at md+ */ }
            <div id={ contentId } className={ cn("max-md:mt-3", !open && "max-md:hidden") }>
                { children }
            </div>
        </Collapsible>
    )
}
