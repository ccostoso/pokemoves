import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const controllerMock = vi.hoisted(() => ({
    handleAdd: vi.fn(),
    learnsets: [] as unknown[],
}))

vi.mock("@/lib/use-search-shell-controller", () => ({
    useSearchShellController: () => ({
        pokemonList: [],
        versionGroupName: "yellow",
        setVersionGroupName: vi.fn(),
        pokemonName: "charmander",
        setPokemonName: vi.fn(),
        learnsets: controllerMock.learnsets,
        error: null,
        pokemonListLoading: false,
        isSubmitting: false,
        hasUnsavedChanges: false,
        handleAddLearnsetToLearnsetDeck: controllerMock.handleAdd,
    }),
}))
vi.mock("./pokemon-learnsets/pokemon-learnset-window", () => ({ default: () => null }))
vi.mock("./pokemon-search/pokemon-input", () => ({ default: () => null }))
vi.mock("./pokemon-search/version-input", () => ({ default: () => null }))

const { default: SearchShell } = await import("./search-shell")

const getTrigger = () => screen.getByRole("button", { name: /Enter Pokémon Details/ })

beforeEach(() => {
    vi.clearAllMocks()
    controllerMock.learnsets = []
})

describe("SearchShell search panel", () => {
    it("starts expanded when the deck is empty", () => {
        render(<SearchShell />)

        expect(getTrigger()).toHaveAttribute("aria-expanded", "true")
    })

    it("starts collapsed when the deck already has learnsets", () => {
        controllerMock.learnsets = [{}]

        render(<SearchShell />)

        expect(getTrigger()).toHaveAttribute("aria-expanded", "false")
    })

    it("collapses after a successful add", async () => {
        controllerMock.handleAdd.mockResolvedValue(true)
        const { container } = render(<SearchShell />)

        fireEvent.submit(container.querySelector("form")!)

        await waitFor(() => expect(getTrigger()).toHaveAttribute("aria-expanded", "false"))
    })

    it("stays expanded when the add fails", async () => {
        controllerMock.handleAdd.mockResolvedValue(false)
        const { container } = render(<SearchShell />)

        fireEvent.submit(container.querySelector("form")!)

        await waitFor(() => expect(controllerMock.handleAdd).toHaveBeenCalled())
        expect(getTrigger()).toHaveAttribute("aria-expanded", "true")
    })

    it("toggles when the trigger is tapped", () => {
        render(<SearchShell />)

        fireEvent.click(getTrigger())

        expect(getTrigger()).toHaveAttribute("aria-expanded", "false")
    })
})
