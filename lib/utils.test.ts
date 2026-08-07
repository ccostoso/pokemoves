import { describe, expect, it } from "vitest"
import {
    countLearnsetPairOccurrences,
    createLearnsetInstanceId,
    getLearnsetPairKey,
    getNextLearnsetOccurrence,
    getPokemonDisplayName,
    getRegionalSuffix,
    getTypeNumber,
    getVersionGroupDisplayName,
    mapLearnsetsToDeckItems,
    toLearnsetSignature,
} from "./utils"
import { LevelUpLearnset, PokemonListItem } from "./types"

describe("getRegionalSuffix", () => {
    it("returns the display suffix for a known region", () => {
        expect(getRegionalSuffix("raichu-alola")).toBe("Alola")
        expect(getRegionalSuffix("ninetales-galar")).toBe("Galar")
        expect(getRegionalSuffix("typhlosion-hisui")).toBe("Hisui")
        expect(getRegionalSuffix("wooper-paldea")).toBe("Paldea")
    })

    it("returns null when the name has no region suffix", () => {
        expect(getRegionalSuffix("pikachu")).toBeNull()
    })

    it("returns null when the trailing segment is not a known region", () => {
        expect(getRegionalSuffix("pikachu-rock-star")).toBeNull()
    })
})

describe("getVersionGroupDisplayName", () => {
    it("returns the display name for a known apiName", () => {
        expect(getVersionGroupDisplayName("red-blue")).toBe("Red & Blue")
    })

    it("falls back to the apiName when it is not found", () => {
        expect(getVersionGroupDisplayName("not-a-real-version")).toBe("not-a-real-version")
    })

    it("falls back to an empty string when no apiName is given", () => {
        expect(getVersionGroupDisplayName()).toBe("")
    })
})

describe("getTypeNumber", () => {
    it("returns the id for a known type", () => {
        expect(getTypeNumber("normal")).toBe(1)
        expect(getTypeNumber("flying")).toBe(3)
    })

    it("returns 0 for an unknown type", () => {
        expect(getTypeNumber("not-a-real-type")).toBe(0)
    })
})

describe("getPokemonDisplayName", () => {
    it("returns the species name with no region suffix for a base form", () => {
        const pokemon: PokemonListItem = {
            id: 25,
            name: "pikachu",
            species: { names: [{ name: "Pikachu" }] },
        }

        expect(getPokemonDisplayName(pokemon)).toBe("Pikachu")
    })

    it("appends the region suffix for a regional form", () => {
        const pokemon: PokemonListItem = {
            id: 26,
            name: "raichu-alola",
            species: { names: [{ name: "Raichu" }] },
        }

        expect(getPokemonDisplayName(pokemon)).toBe("Raichu (Alola)")
    })

    it("falls back to the api name when no species names are present", () => {
        const pokemon: PokemonListItem = {
            id: 27,
            name: "some-pokemon",
            species: { names: [] },
        }

        expect(getPokemonDisplayName(pokemon)).toBe("some-pokemon")
    })
})

describe("learnset pair helpers", () => {
    it("builds a composite key from pokemon and version group names", () => {
        expect(getLearnsetPairKey("pikachu", "red-blue")).toBe("pikachu:red-blue")
    })

    it("tracks occurrence counts per pair across repeated calls", () => {
        const occurrenceMap = new Map<string, number>()

        expect(getNextLearnsetOccurrence(occurrenceMap, "pikachu", "red-blue")).toBe(1)
        expect(getNextLearnsetOccurrence(occurrenceMap, "pikachu", "red-blue")).toBe(2)
        expect(getNextLearnsetOccurrence(occurrenceMap, "pikachu", "yellow")).toBe(1)
    })

    it("builds an instance id from the pair key and occurrence", () => {
        expect(createLearnsetInstanceId("pikachu", "red-blue", 2)).toBe("pikachu:red-blue:2")
    })

    it("counts how many learnsets share a pokemon/version group pair", () => {
        const learnsets = [
            makeLearnset("pikachu", "red-blue"),
            makeLearnset("pikachu", "red-blue"),
            makeLearnset("pikachu", "yellow"),
        ]

        expect(countLearnsetPairOccurrences(learnsets, "pikachu", "red-blue")).toBe(2)
        expect(countLearnsetPairOccurrences(learnsets, "pikachu", "yellow")).toBe(1)
        expect(countLearnsetPairOccurrences(learnsets, "bulbasaur", "red-blue")).toBe(0)
    })
})

describe("mapLearnsetsToDeckItems", () => {
    it("maps learnsets to deck items with display names and sort order", () => {
        const learnsets = [makeLearnset("pikachu", "red-blue"), makeLearnset("bulbasaur", "yellow")]

        expect(mapLearnsetsToDeckItems(learnsets)).toEqual([
            {
                pokemonId: 25,
                pokemonApiName: "pikachu",
                pokemonDisplayName: "Pikachu",
                versionGroupApiName: "red-blue",
                versionGroupDisplayName: "Red & Blue",
                sortOrder: 0,
            },
            {
                pokemonId: 25,
                pokemonApiName: "bulbasaur",
                pokemonDisplayName: "Pikachu",
                versionGroupApiName: "yellow",
                versionGroupDisplayName: "Yellow",
                sortOrder: 1,
            },
        ])
    })

    it("throws when the learnset has no pokemon entry with an id", () => {
        const learnset = makeLearnset("pikachu", "red-blue")
        learnset.pokemon = []

        expect(() => mapLearnsetsToDeckItems([learnset])).toThrow(
            /Missing pokemonId for learnset "pikachu" in "red-blue"/,
        )
    })
})

describe("toLearnsetSignature", () => {
    it("joins pokemon/version group pairs into a stable signature", () => {
        const learnsets = [makeLearnset("pikachu", "red-blue"), makeLearnset("bulbasaur", "yellow")]

        expect(toLearnsetSignature(learnsets)).toBe("pikachu:red-blue|bulbasaur:yellow")
    })

    it("returns an empty string for an empty list", () => {
        expect(toLearnsetSignature([])).toBe("")
    })
})

function makeLearnset(pokemonName: string, versionGroupName: string): LevelUpLearnset {
    return {
        id: getLearnsetPairKey(pokemonName, versionGroupName),
        pokemonName,
        versionGroupName,
        pokemon: [
            {
                id: 25,
                name: pokemonName,
                pokemonmoves: [],
                species: { names: [{ name: "Pikachu" }] },
            },
        ],
    }
}
