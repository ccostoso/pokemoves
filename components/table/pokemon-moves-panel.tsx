import PokemonTable from "./pokemon-table"
import { queryResult } from "@/lib/types"

interface PokemonMovesPanelProps {
    resultArr: queryResult[]
    onRemoveResult: (index: number) => void
}

export default function PokemonMovesPanel({
    resultArr,
    onRemoveResult,
}: PokemonMovesPanelProps) {
    return (
        <div className="flex w-max flex-nowrap justify-start gap-4 pb-2">
            {resultArr.length > 0 ? (
                resultArr.map((result, index) => (
                    <div key={index} className="mb-8">
                        <PokemonTable
                            result={result}
                            onRemove={() => onRemoveResult(index)}
                        />
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">
                    No results to display.
                </p>
            )}
        </div>
    )
}
