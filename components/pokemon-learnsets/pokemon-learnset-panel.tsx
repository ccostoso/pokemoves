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

interface PokemonLearnsetPanelProps {
    learnsetList: LevelUpLearnset[]
    onRemoveLearnset: (index: number) => void
    onReorderLearnset: (fromIndex: number, toIndex: number) => void
}

function SortableItem({
    id,
    children,
}: {
    id: string
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
        <div ref={setNodeRef} style={style}>
            {children(dragHandleProps)}
        </div>
    )
}

export default function PokemonLearnsetPanel({
    learnsetList,
    onRemoveLearnset,
    onReorderLearnset,
}: PokemonLearnsetPanelProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const previousLengthRef = useRef(learnsetList.length)

    // PokemonLearnsetPanel
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const fromIndex = learnsetList.findIndex(
            (item) => item.id === active.id,
        )
        const toIndex = learnsetList.findIndex((item) => item.id === over.id)
        onReorderLearnset(fromIndex, toIndex)
    }

    useEffect(() => {
        if (learnsetList.length > previousLengthRef.current) {
            const container = scrollContainerRef.current
            if (container) {
                requestAnimationFrame(() => {
                    container.scrollTo({
                        left: container.scrollWidth,
                        behavior: "smooth",
                    })
                })
            }
        }

        previousLengthRef.current = learnsetList.length
    }, [learnsetList.length])

    return (
        <div
            ref={scrollContainerRef}
            className="w-full max-w-full overflow-x-auto"
        >
            {learnsetList.length > 0 ? (
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={learnsetList.map((item) => item.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex w-max min-w-max flex-nowrap justify-start gap-4 pb-2">
                            {learnsetList.map((item, index) => (
                                <SortableItem key={item.id} id={item.id}>
                                    {(dragHandleProps) => (
                                        <div className="mb-8">
                                            <PokemonLearnsetCard
                                                item={item}
                                                onRemove={() =>
                                                    onRemoveLearnset(index)
                                                }
                                                dragHandleProps={
                                                    dragHandleProps
                                                }
                                            />
                                        </div>
                                    )}
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <p className="text-center text-gray-500">
                    No results to display.
                </p>
            )}
        </div>
    )
}
