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
