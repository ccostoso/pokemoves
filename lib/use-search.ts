// Commenting out for future use.

/*
import useSWR, { Fetcher, mutate } from "swr"
import { getLevelUpMovesByPokemonNameAndGeneration, LevelUpResult } from "./actions"

type Move = {
    level: number
    movelearnmethod: {
        name: string
    }
    move: {
        name: string
        type: {
            name: string
        }
    }
}

const fetcher: Fetcher<LevelUpResult, [string, string]> = async ([name, version]) => {
    return getLevelUpMovesByPokemonNameAndGeneration(name, version)
}

export function useLevelUpMovesByPokemonNameAndGeneration(
    pokemonName: string,
    versionGroupName: string
) {
    const { data, error, isLoading } = useSWR(
        [pokemonName, versionGroupName],
        fetcher,
        {
            revalidateOnFocus: false, // Don't revalidate on window focus
            revalidateOnReconnect: false, // Don't revalidate on network reconnect
        }
    )

    const revalidateMoves = () => {
        // Manually trigger revalidation of the moves data
        mutate([pokemonName, versionGroupName])
    }

    return {
        moves: data,
        isLoading: isLoading,
        isError: error,
        revalidateMoves,
    }
}
*/

// If, later, we want to add again, we should add the following to search-shell.tsx:
/* 
    import { useLevelUpMovesByPokemonNameAndGeneration } from "@/lib/use-search"
    (...)
    export default function SearchShell() {
    (...)
        const { revalidateMoves } = useLevelUpMovesByPokemonNameAndGeneration(
            "",
            "",
        ) // Initialize with empty values.
         (...)
    }
*/