import { beforeEach, describe, expect, it, vi } from "vitest"

const gqlRequestMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/graphql/graphql-client", () => ({ gqlClient: { request: gqlRequestMock }, POKEAPI_SCHEMA_MODE: "v1beta" }))
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }))

const {
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndVersionGroup,
} = await import("./graphql-actions")

beforeEach(() => {
    vi.clearAllMocks()
})

describe("getAllPokemonByVersionGroupName", () => {
    it("throws when the response has neither pokemon field", async () => {
        gqlRequestMock.mockResolvedValue({})

        await expect(getAllPokemonByVersionGroupName("red-blue")).rejects.toThrow(
            "Empty response, skipping cache",
        )
    })

    it("requests with the given versionGroupName and returns the mapped list", async () => {
        gqlRequestMock.mockResolvedValue({
            pokemon: [{ id: 1, name: "bulbasaur", pokemonspecy: { pokemonspeciesnames: [{ name: "Bulbasaur" }] } }],
        })

        const result = await getAllPokemonByVersionGroupName("red-blue")

        expect(gqlRequestMock).toHaveBeenCalledWith(expect.any(String), { versionGroupName: "red-blue" })
        expect(result).toEqual([{ id: 1, name: "bulbasaur", species: { names: [{ name: "Bulbasaur" }] } }])
    })
})

describe("getLevelUpMovesByPokemonNameAndVersionGroup", () => {
    it("throws when the response has neither pokemon field", async () => {
        gqlRequestMock.mockResolvedValue({})

        await expect(
            getLevelUpMovesByPokemonNameAndVersionGroup("pikachu", "red-blue"),
        ).rejects.toThrow("Empty response, skipping cache")
    })

    it("requests with the given variables and returns the mapped learnset", async () => {
        gqlRequestMock.mockResolvedValue({
            pokemon: [{ id: 25, name: "pikachu", pokemonmoves: [] }],
        })

        const result = await getLevelUpMovesByPokemonNameAndVersionGroup("pikachu", "red-blue")

        expect(gqlRequestMock).toHaveBeenCalledWith(expect.any(String), {
            pokemonName: "pikachu",
            versionGroupName: "red-blue",
        })
        expect(result.pokemonName).toBe("pikachu")
        expect(result.versionGroupName).toBe("red-blue")
    })
})
