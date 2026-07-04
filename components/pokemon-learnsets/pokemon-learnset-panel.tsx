import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { LevelUpLearnset } from "@/lib/types"
import {
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HTMLAttributes, ReactNode, useEffect, useRef } from "react"
import PokemonLearnsetCard from "./pokemon-learnset-card"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type PokemonLearnsetPanelProps = {
    learnsets: LevelUpLearnset[],
    onRemoveLearnset: (index: number) => void,
    onReorderLearnsetDeck: (fromIndex: number, toIndex: number) => void
}

function SortableItem({
    id,
    children,
}: {
    id: string,
    children: (dragHandleProps: HTMLAttributes<HTMLButtonElement>) => ReactNode
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const dragHandleProps = {
        ...attributes,
        ...listeners,
    } as HTMLAttributes<HTMLButtonElement>

    return (
        <div ref={ setNodeRef } style={ style }>
            { children(dragHandleProps) }
        </div>
    )
}

export default function PokemonLearnsetPanel({
    learnsets,
    onRemoveLearnset,
    onReorderLearnsetDeck,
}: PokemonLearnsetPanelProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const previousLengthRef = useRef(learnsets.length)

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
        const { active, over } = event
        if (!over || active.id === over.id) return
        const fromIndex = learnsets.findIndex(
            (item) => item.id === active.id,
        )
        const toIndex = learnsets.findIndex((item) => item.id === over.id)
        onReorderLearnsetDeck(fromIndex, toIndex)
    }

    return (
        <ScrollArea ref={ scrollAreaRef } className="w-full max-w-full">
            { learnsets.length > 0 ? (
                <DndContext id="learnset-dnd-context" onDragEnd={ handleDragEnd }>
                    <SortableContext
                        items={ learnsets.map((item) => item.id) }
                        strategy={ horizontalListSortingStrategy }
                    >
                        <div className="flex w-max min-w-max flex-nowrap justify-start gap-4 px-4 pt-4 pb-2">
                            { learnsets.map((item, index) => (
                                <SortableItem key={ item.id } id={ item.id }>
                                    { (dragHandleProps) => (
                                        <div className="mb-8">
                                            <PokemonLearnsetCard
                                                item={ item }
                                                onRemove={ () =>
                                                    onRemoveLearnset(index)
                                                }
                                                dragHandleProps={
                                                    dragHandleProps
                                                }
                                            />
                                        </div>
                                    ) }
                                </SortableItem>
                            )) }
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <p className="text-center text-gray-500">
                    No results to display.
                </p>
            ) }
            <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
    )
}
