"use server"

import { gqlClient } from "../graphql/graphql-client"
import { GET_POKEMON_BY_VERSIONGROUP_NAME, GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP } from "../queries"

import { unstable_cache } from "next/cache"
import { pokemonListCacheKey, POKEMON_LIST_TAG, movesCacheKey, MOVES_TAG } from "../cache-keys"
import { LevelUpLearnset, PokemonListItem } from "../types"
import {
    mapLevelUpResponse,
    mapPokemonListResponse,
    RawLevelUpResponse,
    RawPokemonListResponse,
} from "../graphql/graphql-mappers"

// --- Exported server actions ---

export const getAllPokemonByVersionGroupName = unstable_cache(
    async (versionGroupName: string): Promise<PokemonListItem[]> => {
        const response = await gqlClient.request<RawPokemonListResponse>(GET_POKEMON_BY_VERSIONGROUP_NAME, {
            versionGroupName,
        })

        if (!response.pokemon && !response.pokemon_v2_pokemon) {
            throw new Error("Empty response, skipping cache")
        }

        return mapPokemonListResponse(response)
    },
    // The cache key factory — Next.js calls this with the same args to derive the key
    [pokemonListCacheKey("")],
    {
        tags: [POKEMON_LIST_TAG],
        revalidate: 60 * 60 * 24 * 7, // one week
    },
)

export const getLevelUpMovesByPokemonNameAndVersionGroup = unstable_cache(
    async (pokemonName: string, versionGroupName: string): Promise<LevelUpLearnset> => {
        const response = await gqlClient.request<RawLevelUpResponse>(
            GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP,
            { pokemonName, versionGroupName },
        )

        if (!response.pokemon && !response.pokemon_v2_pokemon) {
            throw new Error("Empty response, skipping cache")
        }

        return mapLevelUpResponse(response, versionGroupName)
    },
    [movesCacheKey("", "")],
    {
        tags: [MOVES_TAG],
        revalidate: 60 * 60 * 24 * 7,
    },
)
