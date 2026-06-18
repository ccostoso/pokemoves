"use server"

import { gqlClient } from "./graphql-client"
import { GET_POKEMON_BY_VERSIONGROUP_NAME, GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION } from "./queries"

export const getAllPokemonByVersionGroupName = async (versionGroupName: string) => {
    const response = await gqlClient.request(GET_POKEMON_BY_VERSIONGROUP_NAME, {
        versionGroupName,
    })
    const pokemon = (response as any).pokemon_v2_pokemon ?? []

    // Normalize v2 schema fields to the shape used by UI components.
    return pokemon.map((p: any) => ({
        id: p.id,
        name: p.name,
        pokemonspecy: {
            pokemonspeciesnames:
                p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames ?? [],
        },
    }))
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

    const pokemon = ((response as any).pokemon_v2_pokemon ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        pokemonmoves: (p.pokemon_v2_pokemonmoves ?? []).map((m: any) => ({
            level: m.level,
            movelearnmethod: {
                name: m.pokemon_v2_movelearnmethod?.name,
            },
            move: {
                name: m.pokemon_v2_move?.name,
                type: {
                    name: m.pokemon_v2_move?.pokemon_v2_type?.name,
                },
                movenames: m.pokemon_v2_move?.pokemon_v2_movenames ?? [],
            },
        })),
    }))

    const pokemonspecies = ((response as any).pokemon_v2_pokemonspecies ?? []).map(
        (s: any) => ({
            pokemonspeciesnames: s.pokemon_v2_pokemonspeciesnames ?? [],
        }),
    )

    return {
        pokemon,
        pokemonspecies,
    }
}