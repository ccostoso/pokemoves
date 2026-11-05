import { LocalizedName } from "./graphql/graphql-mappers"

// --- Normalized output types for frontend ---

export type PokemonListItem = {
    id: number,
    name: string,
    species: {
        names: LocalizedName[]
    }
}

export type LevelUpMove = {
    level: number,
    movelearnmethod: { name: string },
    move: {
        name: string,
        type: { name: string },
        movenames: LocalizedName[]
    }
}

type BaseLearnset = {
    pokemonName: string,
    versionGroupName: string
}

// The shape returned by the API/mapper layer. It deliberately has no `id` —
// the SPA is the sole owner of learnset instance IDs (see createLearnsetInstanceId),
// since a server-cached response can't provide a per-instance, per-occurrence ID anyway.
export type LevelUpLearnsetData = BaseLearnset & {
    pokemon: Array<{
        id: number,
        name: string,
        pokemonmoves: LevelUpMove[],
        species: {
            names: LocalizedName[]
        }
    }>
}

export type LevelUpLearnset = LevelUpLearnsetData & {
    id: string
}

export type LearnsetDeckItem = {
    pokemonId: number,
    pokemonApiName: string,
    pokemonDisplayName: string,
    versionGroupApiName: string,
    versionGroupDisplayName: string,
    sortOrder: number
}

export type DuplicateLearnsetResult =
    | { ok: true, deckId: string }
    | { ok: false, message: string }

export type EmailTemplate = {
    subject: string,
    html: string,
    text: string
}
