import { LocalizedName } from "./actions/graphql-actions"

// --- Normalized output types for frontend ---

export type PokemonListItem = {
    id: number,
    name: string,
    pokemonspecy: {
        pokemonspeciesnames: LocalizedName[]
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

export type LevelUpLearnset = {
    pokemon: Array<{
        id: number,
        name: string,
        pokemonmoves: LevelUpMove[],
        pokemonspecy: {
            pokemonspeciesnames: LocalizedName[]
        }
    }>,
    pokemonName: string,
    versionGroupName: string,
    id: string // Unique ID for DnD tracking
}

export type LearnsetDeckItemData = {
    pokemonName: string,
    versionGroupName: string,
    sortOrder: number
}