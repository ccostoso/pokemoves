import { gql } from 'graphql-request'

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

export const GET_POKEMON_BY_VERSIONGROUP_NAME = gql`
query getPokemonByVersionGroupName($versionGroupName: String!) {
  pokemon(
    where: {pokemongameindices: {version: {versiongroup: {name: {_eq: $versionGroupName}}}}}
  ) {
    id
    name
  }
}`

export const GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION = gql`
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
      }
    }
  }
}`

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
