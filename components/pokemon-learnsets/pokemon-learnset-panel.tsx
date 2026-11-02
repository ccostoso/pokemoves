import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { LevelUpLearnset } from "@/lib/types"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react"
import PokemonLearnsetCard from "./pokemon-learnset-card"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { cn, getClosestIndex } from "@/lib/utils"

type PokemonLearnsetPanelProps = {
    learnsets: LevelUpLearnset[],
    onRemoveLearnsetFromDeck: (index: number) => void,
    onReorderLearnsetDeck: (fromIndex: number, toIndex: number) => void
}

function SortableItem({
    id,
    children,
}: {
    id: string,
    children: (dragHandleProps: HTMLAttributes<HTMLButtonElement>) => ReactNode
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const dragHandleProps = {
        ...attributes,
        ...listeners,
    } as HTMLAttributes<HTMLButtonElement>

    return (
        <div
            ref={ setNodeRef }
            style={ style }
            data-learnset-item
            className="max-md:w-(--card-w) max-md:shrink-0 max-md:snap-center max-md:snap-always"
        >
            { children(dragHandleProps) }
        </div>
    )
}

export default function PokemonLearnsetPanel({
    learnsets,
    onRemoveLearnsetFromDeck,
    onReorderLearnsetDeck,
}: PokemonLearnsetPanelProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const previousLengthRef = useRef(learnsets.length)
    const [isDragging, setIsDragging] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    // Mouse acts immediately; touch needs a short hold so swipes and taps don't start a drag
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
        useSensor(KeyboardSensor),
    )

    // Track which card is centered, for the "n of N" indicator
    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector(
            "[data-slot='scroll-area-viewport']",
        ) as HTMLDivElement | null

        if (!viewport) {
            return
        }

        let frame = 0

        const updateActiveIndex = () => {
            frame = 0
            const viewportRect = viewport.getBoundingClientRect()
            const centers = Array.from(viewport.querySelectorAll<HTMLElement>("[data-learnset-item]")).map((item) => {
                const rect = item.getBoundingClientRect()

                return rect.left + rect.width / 2
            })

            setActiveIndex(getClosestIndex(centers, viewportRect.left + viewportRect.width / 2))
        }

        const handleScroll = () => {
            if (!frame) {
                frame = requestAnimationFrame(updateActiveIndex)
            }
        }

        viewport.addEventListener("scroll", handleScroll, { passive: true })

        return () => {
            viewport.removeEventListener("scroll", handleScroll)
            cancelAnimationFrame(frame)
        }
    }, [])

    useEffect(() => {
        if (learnsets.length > previousLengthRef.current) {
            const viewport = scrollAreaRef.current?.querySelector(
                "[data-slot='scroll-area-viewport']",
            ) as HTMLDivElement | null

            if (viewport) {
                requestAnimationFrame(() => {
                    viewport.scrollTo({
                        left: viewport.scrollWidth,
                        behavior: "smooth",
                    })
                })
            }
        }

        previousLengthRef.current = learnsets.length
    }, [learnsets.length])

    const handleDragEnd = (event: DragEndEvent) => {
        setIsDragging(false)

        const { active, over } = event
        if (!over || active.id === over.id) return
        const fromIndex = learnsets.findIndex((item) => item.id === active.id)
        const toIndex = learnsets.findIndex((item) => item.id === over.id)
        onReorderLearnsetDeck(fromIndex, toIndex)
    }

    return (
        <>
            { learnsets.length > 1 && (
                <p className="pt-3 text-center text-sm text-muted-foreground md:hidden" aria-live="polite">
                    { Math.min(activeIndex, learnsets.length - 1) + 1 } of { learnsets.length }
                </p>
            ) }
            { /* @container makes cqw (used for card width) relative to this area rather than the viewport */ }
            <ScrollArea
                ref={ scrollAreaRef }
                className="@container w-full max-w-full"
                // Snapping fights dnd-kit's auto-scroll and transforms, so it is off while dragging
                viewportClassName={ cn(!isDragging && "max-md:snap-x max-md:snap-mandatory", "max-md:overscroll-x-contain") }
            >
                { learnsets.length > 0 ? (
                    <DndContext
                        id="learnset-dnd-context"
                        sensors={ sensors }
                        onDragStart={ () => setIsDragging(true) }
                        onDragEnd={ handleDragEnd }
                        onDragCancel={ () => setIsDragging(false) }
                    >
                        <SortableContext items={ learnsets.map((item) => item.id) } strategy={ horizontalListSortingStrategy }>
                            { /* Mobile padding is half the leftover width so the first and last cards can also center and peek */ }
                            <div className="flex w-max min-w-max flex-nowrap justify-start gap-3 px-4 pt-4 pb-2 [--card-w:82cqw] max-md:px-[calc((100cqw-var(--card-w))/2)] md:gap-4">
                                { learnsets.map((item, index) => (
                                    <SortableItem key={ item.id } id={ item.id }>
                                        { (dragHandleProps) => (
                                            <div className="mb-8">
                                                <PokemonLearnsetCard
                                                    item={ item }
                                                    onRemove={ () => onRemoveLearnsetFromDeck(index) }
                                                    dragHandleProps={ dragHandleProps }
                                                />
                                            </div>
                                        ) }
                                    </SortableItem>
                                )) }
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <h1 className="text-2xl font-bold">No results to display.</h1>
                        <p className="text-muted-foreground">Add a learnset to get started.</p>
                    </div>
                ) }
                <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
        </>
    )
}
