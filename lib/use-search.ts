import useSWR, { Fetcher, mutate } from "swr"
import { gqlClient } from "@/lib/graphql-client"
import { GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION } from "@/lib/queries"

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

const fetcher: Fetcher<Move[], [string, string]> = async ([name, version]) => {
    const response = await gqlClient.request(
        GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION,
        { pokemonName: name, versionGroupName: version }
    )

    const root = response as any
    const pokemon = root.pokemon ?? root.pokemon_v2_pokemon ?? []
    const firstPokemon = pokemon[0]

    return (
        firstPokemon?.pokemonmoves ??
        firstPokemon?.pokemon_v2_pokemonmoves ??
        []
    )
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