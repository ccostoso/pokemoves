import { LocalizedName } from "./actions"

// --- Normalized output types for frontend ---

export type PokemonListItem = {
    id: number
    name: string
    pokemonspecy: {
        pokemonspeciesnames: LocalizedName[]
    }
}

export type MovesetListItem = LevelUpMoveset & {
    id: string // Unique ID for DnD tracking
}

export type LevelUpMove = {
    level: number
    movelearnmethod: { name: string }
    move: {
        name: string
        type: { name: string }
        movenames: LocalizedName[]
    }
}

export type LevelUpMoveset = {
    pokemon: Array<{
        id: number
        name: string
        pokemonmoves: LevelUpMove[]
    }>
    pokemonspecies: Array<{ pokemonspeciesnames: LocalizedName[] }>
    versionGroupName: string
}