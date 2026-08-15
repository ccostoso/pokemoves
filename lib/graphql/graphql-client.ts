/**
 * GraphQL client for PokeAPI. PokeAPI's GraphQL endpoint has shipped two
 * schema versions (v1beta and the newer, occasionally less-stable v1beta2) 
 * with different hostnames: `NEXT_PUBLIC_POKEAPI_SCHEMA_MODE` picks between 
 * them at build/runtime, so this app can move to `v1beta2` by flipping one 
 * `.env` var once that endpoint is stable, without touching any query code.
 */

import { GraphQLClient } from "graphql-request"

export type PokeApiSchemaMode = "v1beta" | "v1beta2"

const schemaModeFromEnv = process.env.NEXT_PUBLIC_POKEAPI_SCHEMA_MODE

// Toggle with NEXT_PUBLIC_POKEAPI_SCHEMA_MODE=v1beta2 when that endpoint is stable again.
export const POKEAPI_SCHEMA_MODE: PokeApiSchemaMode = schemaModeFromEnv === "v1beta2" ? "v1beta2" : "v1beta"

const POKEAPI_ENDPOINTS: Record<PokeApiSchemaMode, string> = {
    v1beta: "https://beta.pokeapi.co/graphql/v1beta",
    v1beta2: "https://graphql.pokeapi.co/v1beta2",
}

export const POKEAPI_GRAPHQL_ENDPOINT = POKEAPI_ENDPOINTS[POKEAPI_SCHEMA_MODE]

export const gqlClient = new GraphQLClient(POKEAPI_GRAPHQL_ENDPOINT)
