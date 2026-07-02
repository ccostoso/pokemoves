import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { versionGroupList } from "./data/versiongroup-list"
import { types } from "./data/type-list"
import { LearnsetDeckItemData, LevelUpLearnset, PokemonListItem } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const REGION_SUFFIXES: Record<string, string> = {
    alola: "Alola",
    galar: "Galar",
    hisui: "Hisui",
    paldea: "Paldea",
}

export function getRegionalSuffix(pokemonName: string): string | null {
    const suffix = pokemonName.split("-").pop()
    return suffix ? (REGION_SUFFIXES[suffix] ?? null) : null
}

export function getVersionGroupDisplayName(apiName: string = ""): string {
    // Look up the version group name from the list, and return the display name if found,
    // otherwise return the API name as a fallback
    const versionGroup = versionGroupList.find((v) => v.apiName === apiName)
    return versionGroup ? versionGroup.name : apiName
}

export function getTypeNumber(typeName: string): number {
    // Map Pokémon type names to numbers for sprite retrieval
    const type = types.find((t) => t.name === typeName)
    return type ? type.id : 0 // Return 0 or a default value if not found
}

export function getPokemonDisplayName(pokemon: PokemonListItem): string {
    const region = getRegionalSuffix(pokemon.name)
    const regionlessName =
        pokemon.pokemonspecy.pokemonspeciesnames[0]?.name ?? pokemon.name

    return region ? `${regionlessName} (${region})` : regionlessName
}


// Learnset Pair Utilities
export function getLearnsetPairKey(
    pokemonName: string,
    versionGroupName: string,
): string {
    return `${pokemonName}:${versionGroupName}`
}

export function getNextLearnsetOccurrence(
    occurrenceMap: Map<string, number>,
    pokemonName: string,
    versionGroupName: string,
): number {
    const key = getLearnsetPairKey(pokemonName, versionGroupName)
    const nextOccurrence = (occurrenceMap.get(key) ?? 0) + 1
    occurrenceMap.set(key, nextOccurrence)

    return nextOccurrence
}

export function createLearnsetInstanceId(
    pokemonName: string,
    versionGroupName: string,
    occurrence: number,
): string {
    return `${getLearnsetPairKey(pokemonName, versionGroupName)}:${occurrence}`
}

export function countLearnsetPairOccurrences(
    learnsetList: LevelUpLearnset[],
    pokemonName: string,
    versionGroupName: string,
): number {
    return learnsetList.filter(
        (learnset) =>
            learnset.pokemonName === pokemonName &&
            learnset.versionGroupName === versionGroupName,
    ).length
}

export function mapLearnsetsToDeckItems(
    learnsetList: LevelUpLearnset[],
): LearnsetDeckItemData[] {
    return learnsetList.map((item, index) => ({
        pokemonName: item.pokemonName,
        versionGroupName: item.versionGroupName,
        sortOrder: index,
    }))
}
