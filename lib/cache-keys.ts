// Cache key: uniquely identifies one specific cached result
// Cache tag: labels a group of results for bulk invalidation

export const pokemonListCacheKey = (versionGroupName: string) => `pokemon-list:${versionGroupName}`

export const pokemonListCacheTag = (versionGroupName: string) => `pokemon-list:${versionGroupName}`

// Top-level tag covering ALL pokemon list entries — useful if you ever
// want to invalidate every cached list at once (e.g. after a data update)
export const POKEMON_LIST_TAG = "pokemon-list"

// For the level-up moves query, two variables means a compound key
export const movesCacheKey = (pokemonName: string, versionGroupName: string) =>
    `moves:${pokemonName}:${versionGroupName}`

export const movesCacheTag = (pokemonName: string, versionGroupName: string) =>
    `moves:${pokemonName}:${versionGroupName}`

export const MOVES_TAG = "moves"
