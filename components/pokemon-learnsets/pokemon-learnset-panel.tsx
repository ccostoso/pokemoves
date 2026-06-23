import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { LevelUpLearnset } from "@/lib/types"
import {
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HTMLAttributes, ReactNode } from "react"
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

    return (
        <div className="flex w-max flex-nowrap justify-start gap-4 pb-2">
            {learnsetList.length > 0 ? (
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={learnsetList.map((item) => item.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {learnsetList.map((item, index) => (
                            <SortableItem key={item.id} id={item.id}>
                                {(dragHandleProps) => (
                                    <div className="mb-8">
                                        <PokemonLearnsetCard
                                            item={item}
                                            onRemove={() =>
                                                onRemoveLearnset(index)
                                            }
                                            dragHandleProps={dragHandleProps}
                                        />
                                    </div>
                                )}
                            </SortableItem>
                        ))}
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
