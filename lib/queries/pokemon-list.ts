import { gql } from "graphql-request"
import { POKEAPI_SCHEMA_MODE } from "../graphql-client"

const GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA = gql`
    query getPokemonByVersionGroupName($versionGroupName: String!) {
        pokemon_v2_pokemon(
            where: { pokemon_v2_pokemonmoves: { pokemon_v2_versiongroup: { name: { _eq: $versionGroupName } } } }
        ) {
            id
            name
            pokemon_v2_pokemonspecy {
                pokemon_v2_pokemonspeciesnames(where: { pokemon_v2_language: { name: { _eq: "en" } } }) {
                    name
                }
            }
        }
    }
`

const GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA2 = gql`
    query getPokemonByVersionGroup($versionGroupName: String!) {
        pokemon(where: { pokemonmoves: { versiongroup: { name: { _eq: $versionGroupName } } } }) {
            id
            name
            pokemonspecy {
                pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
                    name
                }
            }
        }
    }
`

export const GET_POKEMON_BY_VERSIONGROUP_NAME =
    POKEAPI_SCHEMA_MODE === "v1beta2"
        ? GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA2
        : GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA
