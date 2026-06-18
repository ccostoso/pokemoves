import PokemonTable from "./pokemon-table"
import { queryResult } from "@/lib/types"

interface PokemonMovesPanelProps {
    resultArr: queryResult[]
    pokemonName: string
    versionGroupName: string
}

export default function PokemonMovesPanel({
    resultArr,
    pokemonName,
    versionGroupName,
}: PokemonMovesPanelProps) {
    console.log("Received result in PokemonMovesPanel:", resultArr) // Debugging log
    return (
        <PokemonTable
            result={resultArr[resultArr.length - 1] || null}
            pokemonName={pokemonName}
            versionGroupName={versionGroupName}
        />
    )
}
