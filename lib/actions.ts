"use server"

import { gqlClient } from "./graphql-client"
import {
    GET_POKEMON_BY_VERSIONGROUP_NAME,
    GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION,
} from "./queries"

import { unstable_cache } from "next/cache"
import {
    pokemonListCacheKey,
    POKEMON_LIST_TAG,
    movesCacheKey,
    MOVES_TAG,
} from "./cache-keys"
import { LevelUpLearnset, PokemonListItem } from "./types"

// --- Shared primitives ---

// Represents the name of a Pokémon or version group in a specific region/language, 
// as returned by the API. We only care about English names for now.
export type LocalizedName = { name: string }

// --- Pokemon list types ---

type RawPokemonListItem = {
    id: number
    name: string
    // v1beta2
    pokemonspecy?: { pokemonspeciesnames: LocalizedName[] }
    // v1beta
    pokemon_v2_pokemonspecy?: { pokemon_v2_pokemonspeciesnames: LocalizedName[] }
}

type RawPokemonListResponse = {
    // v1beta2
    pokemon?: RawPokemonListItem[]
    // v1beta
    pokemon_v2_pokemon?: RawPokemonListItem[]
}

// --- Level-up move types ---

type RawMove = {
    name: string
    // v1beta2
    type?: { name: string }
    movenames?: LocalizedName[]
    // v1beta
    pokemon_v2_type?: { name: string }
    pokemon_v2_movenames?: LocalizedName[]
}

type RawPokemonMove = {
    level: number
    // v1beta2
    movelearnmethod?: { name: string }
    move?: RawMove
    // v1beta
    pokemon_v2_movelearnmethod?: { name: string }
    pokemon_v2_move?: RawMove
}

type RawLevelUpPokemon = {
    id: number
    name: string
    // v1beta2
    pokemonmoves?: RawPokemonMove[]
    // v1beta
    pokemon_v2_pokemonmoves?: RawPokemonMove[]
}

type RawSpecies = {
    // v1beta2
    pokemonspeciesnames?: LocalizedName[]
    // v1beta
    pokemon_v2_pokemonspeciesnames?: LocalizedName[]
}

type RawLevelUpResponse = {
    // v1beta2
    pokemon?: RawLevelUpPokemon[]
    pokemonspecies?: RawSpecies[]
    // v1beta
    pokemon_v2_pokemon?: RawLevelUpPokemon[]
    pokemon_v2_pokemonspecies?: RawSpecies[]
}

// --- Mapping functions ---

const mapPokemonListResponse = (response: RawPokemonListResponse): PokemonListItem[] => {
    const pokemon = response.pokemon ?? response.pokemon_v2_pokemon ?? []

    return pokemon.map((p) => ({
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

const mapLevelUpResponse = (
    response: RawLevelUpResponse,
    versionGroupName: string,
): LevelUpLearnset => {
    const rawPokemon = response.pokemon ?? response.pokemon_v2_pokemon ?? []
    const rawSpecies = response.pokemonspecies ?? response.pokemon_v2_pokemonspecies ?? []

    const pokemon = rawPokemon.map((p) => ({
        id: p.id,
        name: p.name,
        pokemonmoves: (p.pokemonmoves ?? p.pokemon_v2_pokemonmoves ?? []).map((m) => ({
            level: m.level,
            movelearnmethod: {
                name: m.movelearnmethod?.name ?? m.pokemon_v2_movelearnmethod?.name ?? "",
            },
            move: {
                name: m.move?.name ?? m.pokemon_v2_move?.name ?? "",
                type: {
                    name: m.move?.type?.name ?? m.pokemon_v2_move?.pokemon_v2_type?.name ?? "",
                },
                movenames:
                    m.move?.movenames ?? m.pokemon_v2_move?.pokemon_v2_movenames ?? [],
            },
        })),
    }))

    const pokemonspecies = rawSpecies.map((s) => ({
        pokemonspeciesnames:
            s.pokemonspeciesnames ?? s.pokemon_v2_pokemonspeciesnames ?? [],
    }))

    const id = crypto.randomUUID()

    return { pokemon, pokemonspecies, versionGroupName, id }
}

// --- Exported server actions ---

export const getAllPokemonByVersionGroupName = unstable_cache(
    async (versionGroupName: string): Promise<PokemonListItem[]> => {
        const response = await gqlClient.request<RawPokemonListResponse>(
            GET_POKEMON_BY_VERSIONGROUP_NAME,
            { versionGroupName }
        )

        if (!response.pokemon && !response.pokemon_v2_pokemon) {
            throw new Error('Empty response, skipping cache')
        }

        return mapPokemonListResponse(response)
    },
    // The cache key factory — Next.js calls this with the same args to derive the key
    [pokemonListCacheKey("")],
    {
        tags: [POKEMON_LIST_TAG],
        revalidate: 60 * 60 * 24 * 7, // one week
    }
)

export const getLevelUpMovesByPokemonNameAndGeneration = unstable_cache(
    async (
        pokemonName: string,
        versionGroupName: string,
    ): Promise<LevelUpLearnset> => {
        const response = await gqlClient.request<RawLevelUpResponse>(
            GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION,
            { pokemonName, versionGroupName }
        )

        if (!response.pokemon && !response.pokemon_v2_pokemon) {
            throw new Error('Empty response, skipping cache')
        }

        return mapLevelUpResponse(response, versionGroupName)
    },
    [movesCacheKey("", "")],
    {
        tags: [MOVES_TAG],
        revalidate: 60 * 60 * 24 * 7,
    }
)