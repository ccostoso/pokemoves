"use server"

import { gqlClient } from "./graphql-client"
import { GET_POKEMON_BY_VERSIONGROUP_NAME, GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION } from "./queries"

type LocalizedName = {
    name: string
}

type LegacyPokemonListItem = {
    id: number
    name: string
    pokemonspecy: {
        pokemonspeciesnames: LocalizedName[]
    }
}

type LegacyLevelUpMove = {
    level: number
    movelearnmethod: {
        name: string
    }
    move: {
        name: string
        type: {
            name: string
        }
        movenames: LocalizedName[]
    }
}

type LegacyLevelUpPokemon = {
    id: number
    name: string
    pokemonmoves: LegacyLevelUpMove[]
}

type LegacyLevelUpResponse = {
    pokemon: LegacyLevelUpPokemon[]
    pokemonspecies: {
        pokemonspeciesnames: LocalizedName[]
    }[]
    versionGroupName: string
}

// Mapping functions to transform GraphQL responses into consistent formats for the frontend
const mapPokemonListResponse = (response: unknown): LegacyPokemonListItem[] => {
    // The structure of the response can vary based on the GraphQL schema version, so we check for both possibilities
    const root = response as any
    // We check for both 'pokemon' and 'pokemon_v2_pokemon' to support different schema versions
    // If neither is present, we default to an empty array to avoid runtime errors
    const pokemon = root.pokemon ?? root.pokemon_v2_pokemon ?? []

    // We map the raw response to a consistent format expected by the frontend components
    return pokemon.map((p: any) => ({
        id: p.id,
        name: p.name,
        pokemonspecy: {
            pokemonspeciesnames:
                p.pokemonspecy?.pokemonspeciesnames ??
                p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames ??
                [],
        },
    }))
}

// Similar mapping function for the level-up moves response, handling different schema versions and ensuring a consistent format for the frontend
const mapLevelUpResponse = (response: unknown, versionGroupName: string): LegacyLevelUpResponse => {
    const root = response as any
    const pokemon = (root.pokemon ?? root.pokemon_v2_pokemon ?? []).map(
        (p: any) => ({
            id: p.id,
            name: p.name,
            pokemonmoves: (p.pokemonmoves ?? p.pokemon_v2_pokemonmoves ?? []).map(
                (m: any) => ({
                    level: m.level,
                    movelearnmethod: {
                        name:
                            m.movelearnmethod?.name ??
                            m.pokemon_v2_movelearnmethod?.name ??
                            "",
                    },
                    move: {
                        name: m.move?.name ?? m.pokemon_v2_move?.name ?? "",
                        type: {
                            name:
                                m.move?.type?.name ??
                                m.pokemon_v2_move?.pokemon_v2_type?.name ??
                                "",
                        },
                        movenames:
                            m.move?.movenames ??
                            m.pokemon_v2_move?.pokemon_v2_movenames ??
                            [],
                    },
                }),
            ),
        }),
    )

    const pokemonspecies = (
        root.pokemonspecies ?? root.pokemon_v2_pokemonspecies ?? []
    ).map((s: any) => ({
        pokemonspeciesnames:
            s.pokemonspeciesnames ?? s.pokemon_v2_pokemonspeciesnames ?? [],
    }))

    return {
        pokemon,
        pokemonspecies,
        versionGroupName
    }
}

export const getAllPokemonByVersionGroupName = async (versionGroupName: string) => {
    const response = await gqlClient.request(GET_POKEMON_BY_VERSIONGROUP_NAME, {
        versionGroupName,
    })

    return mapPokemonListResponse(response)
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

    return mapLevelUpResponse(response, versionGroupName)
}