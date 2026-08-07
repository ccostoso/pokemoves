import { describe, expect, it } from "vitest"
import { mapLevelUpResponse, mapPokemonListResponse } from "./graphql-mappers"

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
