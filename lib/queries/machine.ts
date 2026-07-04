import { gql } from "graphql-request"
import { POKEAPI_SCHEMA_MODE } from "../graphql-client"

export const GET_MACHINE_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP_V1BETA = gql`
    query getMachineMovesByPokemonNameAndVersionGroup($pokemonName: String!, $versionGroupName: String!) {
        pokemon_v2_pokemon(where: { name: { _eq: $pokemonName } }) {
            id
            name
            pokemon_v2_pokemonmoves(
                where: {
                    pokemon_v2_versiongroup: { name: { _eq: $versionGroupName } }
                    pokemon_v2_movelearnmethod: { name: { _eq: "machine" } }
                }
            ) {
                level
                pokemon_v2_movelearnmethod {
                    name
                }
                pokemon_v2_move {
                    name
                    pokemon_v2_type {
                        name
                    }
                    pokemon_v2_movenames(where: { pokemon_v2_language: { name: { _eq: "en" } } }) {
                        name
                    }
                    pokemon_v2_machines(where: { pokemon_v2_versiongroup: { name: { _eq: $versionGroupName } } }) {
                        machine_number
                        pokemon_v2_versiongroup {
                            name
                        }
                    }
                }
            }
        }
    }
`

export const GET_MACHINE_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP_V1BETA2 = gql`
    query getMachineMovesByPokemonNameAndVersionGroup($pokemonName: String!, $versionGroupName: String!) {
        pokemon(where: { name: { _eq: $pokemonName } }) {
            id
            name
            pokemonmoves(
                where: {
                    versiongroup: { name: { _eq: $versionGroupName } }
                    movelearnmethod: { name: { _eq: "machine" } }
                }
            ) {
                level
                movelearnmethod {
                    name
                }
                move {
                    name
                    type {
                        name
                    }
                    machines(where: { versiongroup: { name: { _eq: $versionGroupName } } }) {
                        machine_number
                        versiongroup {
                            name
                        }
                    }
                }
            }
        }
    }
`

export const GET_MACHINE_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP =
    POKEAPI_SCHEMA_MODE === "v1beta2"
        ? GET_MACHINE_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP_V1BETA2
        : GET_MACHINE_MOVES_BY_POKEMON_NAME_AND_VERSIONGROUP_V1BETA

export const GET_MACHINE_MOVES_BY_POKEMON_ID_AND_GENERATION = gql`
    query getMachineMovesByPokemonIdAndGeneration($pokemonId: Int!, $versionGroupName: String!) {
        pokemon(where: { id: { _eq: $pokemonId } }) {
            id
            name
            pokemonmoves(
                where: {
                    versiongroup: { name: { _eq: $versionGroupName } }
                    movelearnmethod: { name: { _eq: "machine" } }
                }
            ) {
                level
                movelearnmethod {
                    name
                }
                move {
                    name
                    type {
                        name
                    }
                    machines(where: { versiongroup: { name: { _eq: $versionGroupName } } }) {
                        machine_number
                        versiongroup {
                            name
                        }
                    }
                }
            }
        }
    }
`
