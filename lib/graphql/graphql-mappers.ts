import { LevelUpLearnset, PokemonListItem } from "../types"

// --- Shared primitives ---

// Represents the name of a Pokémon or version group in a specific region/language,
// as returned by the API. We only care about English names for now.
export type LocalizedName = { name: string }

// --- Pokemon list types ---

export type RawPokemonListItem = {
    id: number,
    name: string,
    // v1beta2
    pokemonspecy?: { pokemonspeciesnames: LocalizedName[] },
    // v1beta
    pokemon_v2_pokemonspecy?: {
        pokemon_v2_pokemonspeciesnames: LocalizedName[]
    }
}

export type RawPokemonListResponse = {
    // v1beta2
    pokemon?: RawPokemonListItem[],
    // v1beta
    pokemon_v2_pokemon?: RawPokemonListItem[]
}

// --- Level-up move types ---

type RawMove = {
    name: string,
    // v1beta2
    type?: { name: string },
    movenames?: LocalizedName[],
    // v1beta
    pokemon_v2_type?: { name: string },
    pokemon_v2_movenames?: LocalizedName[]
}

type RawPokemonMove = {
    level: number,
    // v1beta2
    movelearnmethod?: { name: string },
    move?: RawMove,
    // v1beta
    pokemon_v2_movelearnmethod?: { name: string },
    pokemon_v2_move?: RawMove
}

type RawLevelUpPokemon = {
    id: number,
    name: string,
    // v1beta2
    pokemonmoves?: RawPokemonMove[],
    pokemonspecy?: RawSpecies,
    // v1beta
    pokemon_v2_pokemonmoves?: RawPokemonMove[],
    pokemon_v2_pokemonspecy?: RawSpecies
}

type RawSpecies = {
    // v1beta2
    pokemonspeciesnames?: LocalizedName[],
    // v1beta
    pokemon_v2_pokemonspeciesnames?: LocalizedName[]
}

export type RawLevelUpResponse = {
    // v1beta2
    pokemon?: RawLevelUpPokemon[],
    pokemonspecy?: RawSpecies[],
    // v1beta
    pokemon_v2_pokemon?: RawLevelUpPokemon[],
    pokemon_v2_pokemonspecy?: RawSpecies[]
}

// --- Mapping functions ---

export const mapPokemonListResponse = (response: RawPokemonListResponse): PokemonListItem[] => {
    const pokemon = response.pokemon ?? response.pokemon_v2_pokemon ?? []

    return pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        species: {
            names:
                p.pokemonspecy?.pokemonspeciesnames ?? p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames ?? [],
        },
    }))
}

export const mapLevelUpResponse = (response: RawLevelUpResponse, versionGroupName: string): LevelUpLearnset => {
    const rawPokemon = response.pokemon ?? response.pokemon_v2_pokemon ?? []
    const fallbackSpecies = (response.pokemonspecy ?? response.pokemon_v2_pokemonspecy ?? [])[0]

    const pokemon = rawPokemon.map((p) => ({
        id: p.id,
        name: p.name,
        pokemonmoves: (p.pokemonmoves ?? p.pokemon_v2_pokemonmoves ?? []).map((m) => ({
            level: m.level,
            movelearnmethod: {
                name: m.movelearnmethod?.name ?? m.pokemon_v2_movelearnmethod?.name ?? "",
            },
            move: {
                name: m.move?.name ?? m.pokemon_v2_move?.name ?? "",
                type: {
                    name: m.move?.type?.name ?? m.pokemon_v2_move?.pokemon_v2_type?.name ?? "",
                },
                movenames: m.move?.movenames ?? m.pokemon_v2_move?.pokemon_v2_movenames ?? [],
            },
        })),
        species: {
            names:
                p.pokemonspecy?.pokemonspeciesnames ??
                p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames ??
                fallbackSpecies?.pokemonspeciesnames ??
                fallbackSpecies?.pokemon_v2_pokemonspeciesnames ??
                [],
        },
    }))

    const id = crypto.randomUUID()

    const pokemonName = pokemon[0]?.name ?? ""

    return { pokemon, pokemonName, versionGroupName, id }
}
