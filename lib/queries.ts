import { gql } from 'graphql-request'
import { POKEAPI_SCHEMA_MODE } from './graphql-client'

export const GET_ALL_POKEMON_NAMES_AND_IDS = gql`
query getAllPokemon {
  pokemon {
    name
    id
  }
}`

export const GET_ALL_VERSION_GROUP_NAMES_AND_IDS = gql`
query getAllVersionGroups {
  versiongroup {
    name
    id
  }
}`

const GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA = gql`
query getPokemonByVersionGroupName($versionGroupName: String!) {
  pokemon_v2_pokemon(
    where: {
      pokemon_v2_pokemonmoves: {
        pokemon_v2_versiongroup: {name: {_eq: $versionGroupName}}
      }
    }
  ) {
    id
    name
    pokemon_v2_pokemonspecy {
      pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        name
      }
    }
  }
}`

const GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA2 = gql`
query getPokemonByVersionGroup($versionGroupName: String!) {
  pokemon(
    where: {
        pokemonmoves: {
            versiongroup: {name: {_eq: $versionGroupName}}
        }
    }
  ) {
    id
    name
    pokemonspecy {
      pokemonspeciesnames(where: {language: {name: {_eq: "en"}}}) {
        name
      }
    }
  }
}`

export const GET_POKEMON_BY_VERSIONGROUP_NAME =
    POKEAPI_SCHEMA_MODE === 'v1beta2'
        ? GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA2
        : GET_POKEMON_BY_VERSIONGROUP_NAME_V1BETA

const GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION_V1BETA = gql`
query getLevelUpMovesByPokemonNameAndGeneration($pokemonName: String!, $versionGroupName: String!) {
  pokemon_v2_pokemon(where: {name: {_eq: $pokemonName}}) {
    id
    name
    pokemon_v2_pokemonmoves(
      where: {
        pokemon_v2_versiongroup: {name: {_eq: $versionGroupName}}
        pokemon_v2_movelearnmethod: {name: {_eq: "level-up"}}
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
        pokemon_v2_movenames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
          name
        }
      }
    }
  }
  pokemon_v2_pokemonspecies(where: {name: {_eq: $pokemonName}}) {
    pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
      name
    }
  }
}`

const GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION_V1BETA2 = gql`
query getLevelUpMovesByPokemonNameAndGeneration($pokemonName: String!, $versionGroupName: String!) {
  pokemon(where: {name: {_eq: $pokemonName}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: $versionGroupName}}, movelearnmethod: {name: {_eq: "level-up"}}}
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
        movenames(where: {language: {name: {_eq: "en"}}}) {
          name
        }
      }
    }
  }
  pokemonspecies(where: {name: {_eq: $pokemonName}}) {
    pokemonspeciesnames(where: {language: {name: {_eq: "en"}}}) {
      name
    }
  }
}`

export const GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION =
    POKEAPI_SCHEMA_MODE === 'v1beta2'
        ? GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION_V1BETA2
        : GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION_V1BETA

export const GET_LEVEL_UP_MOVES_BY_POKEMON_ID_AND_GENERATION = gql`
query getLevelUpMovesByPokemonIdAndGeneration($pokemonId: Int!, $versionGroupName: String!) {
  pokemon(where: {id: {_eq: $pokemonId}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: $versionGroupName}}, movelearnmethod: {name: {_eq: "level-up"}}}
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
      }
    }
  }
}`

export const GET_MACHINE_MOVES_BY_POKEMON_NAME_AND_GENERATION = gql`
query getMachineMovesByPokemonNameAndGeneration($pokemonName: String!, $versionGroupName: String!) {
  pokemon(where: {name: {_eq: $pokemonName}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: $versionGroupName}}, movelearnmethod: {name: {_eq: "machine"}}}
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
        machines(where: {versiongroup: {name: {_eq: $versionGroupName}}}) {
          machine_number
          versiongroup {
            name
          }
        }
      }
    }
  }
}`

export const GET_MACHINE_MOVES_BY_POKEMON_ID_AND_GENERATION = gql`
query getMachineMovesByPokemonIdAndGeneration($pokemonId: Int!, $versionGroupName: String!) {
  pokemon(where: {id: {_eq: $pokemonId}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: $versionGroupName}}, movelearnmethod: {name: {_eq: "machine"}}}
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
        machines(where: {versiongroup: {name: {_eq: $versionGroupName}}}) {
          machine_number
          versiongroup {
            name
          }
        }
      }
    }
  }
}`
