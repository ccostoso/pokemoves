import { describe, expect, it } from "vitest"
import { searchShellReducer, SearchShellState } from "./use-search-shell-controller"
import { LevelUpLearnset, PokemonListItem } from "./types"

function makeState(overrides: Partial<SearchShellState> = {}): SearchShellState {
    return {
        pokemonList: [],
        versionGroupName: "",
        pokemonName: "",
        learnsets: [],
        savedLearnsetSignature: "",
        requestState: { status: "idle" },
        isPokemonListLoading: false,
        ...overrides,
    }
}

function makePokemon(name: string): PokemonListItem {
    return { id: 1, name, species: { names: [{ name }] } }
}

function makeLearnset(pokemonName: string, versionGroupName: string): LevelUpLearnset {
    return {
        id: `${pokemonName}:${versionGroupName}`,
        pokemonName,
        versionGroupName,
        pokemon: [{ id: 1, name: pokemonName, pokemonmoves: [], species: { names: [{ name: pokemonName }] } }],
    }
}

describe("searchShellReducer", () => {
    it("versionGroupChanged updates the version group and resets pokemon list/name", () => {
        const state = makeState({
            versionGroupName: "red-blue",
            pokemonName: "pikachu",
            pokemonList: [makePokemon("pikachu")],
        })

        const next = searchShellReducer(state, { type: "versionGroupChanged", versionGroupName: "yellow" })

        expect(next.versionGroupName).toBe("yellow")
        expect(next.pokemonName).toBe("")
        expect(next.pokemonList).toEqual([])
    })

    it("pokemonNameChanged updates only the pokemon name", () => {
        const state = makeState()

        const next = searchShellReducer(state, { type: "pokemonNameChanged", pokemonName: "bulbasaur" })

        expect(next.pokemonName).toBe("bulbasaur")
    })

    it("pokemonListLoading sets isPokemonListLoading to true", () => {
        const next = searchShellReducer(makeState(), { type: "pokemonListLoading" })

        expect(next.isPokemonListLoading).toBe(true)
    })

    it("pokemonListLoaded sets the list and clears loading", () => {
        const state = makeState({ isPokemonListLoading: true })
        const pokemonList = [makePokemon("pikachu")]

        const next = searchShellReducer(state, { type: "pokemonListLoaded", pokemonList })

        expect(next.pokemonList).toBe(pokemonList)
        expect(next.isPokemonListLoading).toBe(false)
    })

    it("pokemonListFailed clears the list and loading state", () => {
        const state = makeState({ pokemonList: [makePokemon("pikachu")], isPokemonListLoading: true })

        const next = searchShellReducer(state, { type: "pokemonListFailed" })

        expect(next.pokemonList).toEqual([])
        expect(next.isPokemonListLoading).toBe(false)
    })

    it("addLearnsetToLearnsetDeckStarted sets requestState to loading", () => {
        const next = searchShellReducer(makeState(), { type: "addLearnsetToLearnsetDeckStarted" })

        expect(next.requestState).toEqual({ status: "loading" })
    })

    it("addLearnsetToLearnsetDeckSucceeded appends the learnset and resets requestState", () => {
        const existing = makeLearnset("pikachu", "red-blue")
        const state = makeState({ learnsets: [existing], requestState: { status: "loading" } })
        const added = makeLearnset("bulbasaur", "yellow")

        const next = searchShellReducer(state, { type: "addLearnsetToLearnsetDeckSucceeded", learnset: added })

        expect(next.learnsets).toEqual([existing, added])
        expect(next.requestState).toEqual({ status: "idle" })
    })

    it("addLearnsetToLearnsetDeckFailed sets requestState to error with the message", () => {
        const next = searchShellReducer(makeState(), {
            type: "addLearnsetToLearnsetDeckFailed",
            message: "boom",
        })

        expect(next.requestState).toEqual({ status: "error", message: "boom" })
    })

    it("learnsetsClearedFromDeck empties the learnsets and resets requestState", () => {
        const state = makeState({
            learnsets: [makeLearnset("pikachu", "red-blue")],
            requestState: { status: "error", message: "boom" },
        })

        const next = searchShellReducer(state, { type: "learnsetsClearedFromDeck" })

        expect(next.learnsets).toEqual([])
        expect(next.requestState).toEqual({ status: "idle" })
    })

    it("learnsetRemovedFromDeck removes only the learnset at the given index", () => {
        const state = makeState({
            learnsets: [
                makeLearnset("pikachu", "red-blue"),
                makeLearnset("bulbasaur", "yellow"),
                makeLearnset("charmander", "crystal"),
            ],
        })

        const next = searchShellReducer(state, { type: "learnsetRemovedFromDeck", indexToRemove: 1 })

        expect(next.learnsets.map((l) => l.pokemonName)).toEqual(["pikachu", "charmander"])
    })

    describe("learnsetDeckReordered", () => {
        const state = makeState({
            learnsets: [
                makeLearnset("a", "v"),
                makeLearnset("b", "v"),
                makeLearnset("c", "v"),
            ],
        })

        it("moves an item from the front to the back", () => {
            const next = searchShellReducer(state, { type: "learnsetDeckReordered", fromIndex: 0, toIndex: 2 })

            expect(next.learnsets.map((l) => l.pokemonName)).toEqual(["b", "c", "a"])
        })

        it("moves an item from the back to the front", () => {
            const next = searchShellReducer(state, { type: "learnsetDeckReordered", fromIndex: 2, toIndex: 0 })

            expect(next.learnsets.map((l) => l.pokemonName)).toEqual(["c", "a", "b"])
        })

        it("is a no-op when fromIndex equals toIndex", () => {
            const next = searchShellReducer(state, { type: "learnsetDeckReordered", fromIndex: 1, toIndex: 1 })

            expect(next.learnsets.map((l) => l.pokemonName)).toEqual(["a", "b", "c"])
        })
    })

    it("learnsetHydrationStarted sets requestState to loading", () => {
        const next = searchShellReducer(makeState(), { type: "learnsetHydrationStarted" })

        expect(next.requestState).toEqual({ status: "loading" })
    })

    it("learnsetHydrationSucceeded sets the learnsets and resets requestState", () => {
        const learnsets = [makeLearnset("pikachu", "red-blue")]
        const state = makeState({ requestState: { status: "loading" } })

        const next = searchShellReducer(state, { type: "learnsetHydrationSucceeded", learnsets })

        expect(next.learnsets).toBe(learnsets)
        expect(next.requestState).toEqual({ status: "idle" })
    })

    it("learnsetHydrationFailed sets requestState to error with the message", () => {
        const next = searchShellReducer(makeState(), {
            type: "learnsetHydrationFailed",
            message: "hydration boom",
        })

        expect(next.requestState).toEqual({ status: "error", message: "hydration boom" })
    })

    it("savedBaselineSynced updates only the saved signature", () => {
        const state = makeState({ learnsets: [makeLearnset("pikachu", "red-blue")] })

        const next = searchShellReducer(state, { type: "savedBaselineSynced", signature: "pikachu:red-blue" })

        expect(next.savedLearnsetSignature).toBe("pikachu:red-blue")
        expect(next.learnsets).toBe(state.learnsets)
    })

    it("learnsetReverted replaces the learnsets and resets requestState", () => {
        const state = makeState({
            learnsets: [makeLearnset("pikachu", "red-blue")],
            requestState: { status: "error", message: "boom" },
        })
        const reverted = [makeLearnset("bulbasaur", "yellow")]

        const next = searchShellReducer(state, { type: "learnsetReverted", learnsets: reverted })

        expect(next.learnsets).toBe(reverted)
        expect(next.requestState).toEqual({ status: "idle" })
    })

    it("returns the same state reference for an unknown action", () => {
        const state = makeState()

        // @ts-expect-error - intentionally testing the default branch with an invalid action
        const next = searchShellReducer(state, { type: "notARealAction" })

        expect(next).toBe(state)
    })
})
