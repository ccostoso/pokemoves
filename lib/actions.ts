"use server"

import { gqlClient } from "./graphql-client"
import { GET_POKEMON_BY_VERSIONGROUP_NAME, GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION } from "./queries"

export const getAllPokemonByVersionGroupName = async (versionGroupName: string) => {
    const response = await gqlClient.request(GET_POKEMON_BY_VERSIONGROUP_NAME, {
        versionGroupName,
    })
    return response.pokemon
}

export const getLevelUpMovesByPokemonNameAndGeneration = async (
    pokemonName: string,
    versionGroupName: string,
) => {
    const response = await gqlClient.request(
        GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION,
        {
            pokemonName,
            versionGroupName,
        },
    )
    return response.pokemon[0]?.pokemonmoves || []
}