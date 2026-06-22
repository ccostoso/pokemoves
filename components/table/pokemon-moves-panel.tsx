import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { queryResult } from "@/lib/types"
import {
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HTMLAttributes, ReactNode } from "react"
import PokemonMovesCard from "./pokemon-moves-card"

interface PokemonMovesPanelProps {
    resultArr: queryResult[]
    onRemoveResult: (index: number) => void
    onReorderResult: (fromIndex: number, toIndex: number) => void
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

export default function PokemonMovesPanel({
    resultArr,
    onRemoveResult,
    onReorderResult,
}: PokemonMovesPanelProps) {
    // PokemonMovesPanel
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const fromIndex = resultArr.findIndex((r) => r.id === active.id)
        const toIndex = resultArr.findIndex((r) => r.id === over.id)
        onReorderResult(fromIndex, toIndex)
    }

    return (
        <div className="flex w-max flex-nowrap justify-start gap-4 pb-2">
            {resultArr.length > 0 ? (
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={resultArr.map((r) => r.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {resultArr.map((result, index) => (
                            <SortableItem key={result.id} id={result.id}>
                                {(dragHandleProps) => (
                                    <div className="mb-8">
                                        <PokemonMovesCard
                                            result={result}
                                            onRemove={() =>
                                                onRemoveResult(index)
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
