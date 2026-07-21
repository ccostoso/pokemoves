import { LocalizedName } from "./actions/graphql-actions"

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
    versionGroupName: string,
    id: string
}

export type LevelUpLearnset = BaseLearnset & {
    pokemon: Array<{
        id: number,
        name: string,
        pokemonmoves: LevelUpMove[],
        species: {
            names: LocalizedName[]
        }
    }>
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
