import { beforeEach, describe, expect, it, vi } from "vitest"

const gqlRequestMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/graphql-client", () => ({ gqlClient: { request: gqlRequestMock }, POKEAPI_SCHEMA_MODE: "v1beta" }))
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }))

const {
    mapPokemonListResponse,
    mapLevelUpResponse,
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndVersionGroup,
} = await import("./graphql-actions")

beforeEach(() => {
    vi.clearAllMocks()
})

describe("mapPokemonListResponse", () => {
    it("maps the v1beta shape (pokemon_v2_* fields)", () => {
        const result = mapPokemonListResponse({
            pokemon_v2_pokemon: [
                {
                    id: 25,
                    name: "pikachu",
                    pokemon_v2_pokemonspecy: { pokemon_v2_pokemonspeciesnames: [{ name: "Pikachu" }] },
                },
            ],
        })

        expect(result).toEqual([{ id: 25, name: "pikachu", species: { names: [{ name: "Pikachu" }] } }])
    })

    it("maps the v1beta2 shape (bare field names)", () => {
        const result = mapPokemonListResponse({
            pokemon: [
                {
                    id: 1,
                    name: "bulbasaur",
                    pokemonspecy: { pokemonspeciesnames: [{ name: "Bulbasaur" }] },
                },
            ],
        })

        expect(result).toEqual([{ id: 1, name: "bulbasaur", species: { names: [{ name: "Bulbasaur" }] } }])
    })

    it("defaults species names to an empty array when absent", () => {
        const result = mapPokemonListResponse({ pokemon: [{ id: 1, name: "bulbasaur" }] })

        expect(result).toEqual([{ id: 1, name: "bulbasaur", species: { names: [] } }])
    })

    it("returns an empty array when neither pokemon field is present", () => {
        expect(mapPokemonListResponse({})).toEqual([])
    })
})

describe("mapLevelUpResponse", () => {
    it("maps the v1beta shape (pokemon_v2_* fields) including moves", () => {
        const result = mapLevelUpResponse(
            {
                pokemon_v2_pokemon: [
                    {
                        id: 25,
                        name: "pikachu",
                        pokemon_v2_pokemonspecy: { pokemon_v2_pokemonspeciesnames: [{ name: "Pikachu" }] },
                        pokemon_v2_pokemonmoves: [
                            {
                                level: 1,
                                pokemon_v2_movelearnmethod: { name: "level-up" },
                                pokemon_v2_move: {
                                    name: "thunder-shock",
                                    pokemon_v2_type: { name: "electric" },
                                    pokemon_v2_movenames: [{ name: "Thunder Shock" }],
                                },
                            },
                        ],
                    },
                ],
            },
            "red-blue",
        )

        expect(result).toEqual({
            id: expect.any(String),
            pokemonName: "pikachu",
            versionGroupName: "red-blue",
            pokemon: [
                {
                    id: 25,
                    name: "pikachu",
                    species: { names: [{ name: "Pikachu" }] },
                    pokemonmoves: [
                        {
                            level: 1,
                            movelearnmethod: { name: "level-up" },
                            move: {
                                name: "thunder-shock",
                                type: { name: "electric" },
                                movenames: [{ name: "Thunder Shock" }],
                            },
                        },
                    ],
                },
            ],
        })
    })

    it("maps the v1beta2 shape (bare field names) including moves", () => {
        const result = mapLevelUpResponse(
            {
                pokemon: [
                    {
                        id: 1,
                        name: "bulbasaur",
                        pokemonspecy: { pokemonspeciesnames: [{ name: "Bulbasaur" }] },
                        pokemonmoves: [
                            {
                                level: 3,
                                movelearnmethod: { name: "level-up" },
                                move: {
                                    name: "tackle",
                                    type: { name: "normal" },
                                    movenames: [{ name: "Tackle" }],
                                },
                            },
                        ],
                    },
                ],
            },
            "yellow",
        )

        expect(result).toEqual({
            id: expect.any(String),
            pokemonName: "bulbasaur",
            versionGroupName: "yellow",
            pokemon: [
                {
                    id: 1,
                    name: "bulbasaur",
                    species: { names: [{ name: "Bulbasaur" }] },
                    pokemonmoves: [
                        {
                            level: 3,
                            movelearnmethod: { name: "level-up" },
                            move: {
                                name: "tackle",
                                type: { name: "normal" },
                                movenames: [{ name: "Tackle" }],
                            },
                        },
                    ],
                },
            ],
        })
    })

    it("falls back to the top-level species entry when a pokemon has no species of its own", () => {
        const result = mapLevelUpResponse(
            {
                pokemon: [{ id: 1, name: "bulbasaur", pokemonmoves: [] }],
                pokemonspecy: [{ pokemonspeciesnames: [{ name: "Bulbasaur" }] }],
            },
            "yellow",
        )

        expect(result.pokemon[0].species).toEqual({ names: [{ name: "Bulbasaur" }] })
    })

    it("defaults to an empty pokemon list and empty pokemonName when no pokemon is present", () => {
        const result = mapLevelUpResponse({}, "yellow")

        expect(result).toEqual({
            id: expect.any(String),
            pokemonName: "",
            versionGroupName: "yellow",
            pokemon: [],
        })
    })
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
