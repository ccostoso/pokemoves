import { GraphQLClient } from 'graphql-request';

// v1beta2 currently returns empty rows for move/game-index tables.
// Use the actively populated GraphQL endpoint.
export const gqlClient = new GraphQLClient('https://beta.pokeapi.co/graphql/v1beta');