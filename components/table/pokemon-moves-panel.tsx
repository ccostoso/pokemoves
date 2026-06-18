import PokemonTable from "./pokemon-table"
import { queryResult } from "@/lib/types"

interface PokemonMovesPanelProps {
    resultArr: queryResult[]
}

export default function PokemonMovesPanel({
    resultArr,
}: PokemonMovesPanelProps) {
    return (
        <div className="flex flex-nowrap justify-center gap-4 pb-2">
            {resultArr.length > 0 ? (
                resultArr.map((result, index) => (
                    <div key={index} className="mb-8">
                        <PokemonTable result={result} />
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
