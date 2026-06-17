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

export const GET_LEVEL_UP_MOVES_BY_POKEMON_NAME_AND_GENERATION = gql`
query getLevelUpMovesByPokemonNameAndGeneration {
  pokemon(where: {name: {_eq: ""}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: "red-blue"}}, movelearnmethod: {name: {_eq: "level-up"}}}
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
query getLevelUpMovesByPokemonIdAndGeneration {
  pokemon(where: {id: {_eq: ""}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: "red-blue"}}, movelearnmethod: {name: {_eq: "level-up"}}}
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
query getMachineMovesByPokemonNameAndGeneration {
  pokemon(where: {name: {_eq: ""}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: "red-blue"}}, movelearnmethod: {name: {_eq: "machine"}}}
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
        machines(where: {versiongroup: {name: {_eq: "red-blue"}}}) {
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
query getMachineMovesByPokemonIdAndGeneration {
  pokemon(where: {id: {_eq: ""}}) {
    id
    name
    pokemonmoves(
      where: {versiongroup: {name: {_eq: "red-blue"}}, movelearnmethod: {name: {_eq: "machine"}}}
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
        machines(where: {versiongroup: {name: {_eq: "red-blue"}}}) {
          machine_number
          versiongroup {
            name
          }
        }
      }
    }
  }
}`
