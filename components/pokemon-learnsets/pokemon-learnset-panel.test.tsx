import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { LevelUpLearnset } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"

vi.mock("next/image", () => ({
    // eslint-disable-next-line @next/next/no-img-element
    default: ({ alt }: { alt: string }) => <img alt={ alt } />,
}))

const makeLearnset = (id: number): LevelUpLearnset => ({
    id: `mon${id}:yellow:1`,
    pokemonName: `mon${id}`,
    versionGroupName: "yellow",
    pokemon: [{ id, name: `mon${id}`, species: { names: [{ name: `Mon ${id}` }] }, pokemonmoves: [] }],
} as LevelUpLearnset)

const renderPanel = (count: number) =>
    render(
        <PokemonLearnsetPanel
            learnsets={ Array.from({ length: count }, (_, index) => makeLearnset(index + 1)) }
            onRemoveLearnsetFromDeck={ vi.fn() }
            onReorderLearnsetDeck={ vi.fn() }
        />,
    )

describe("PokemonLearnsetPanel", () => {
    it("disables browser touch gestures on the drag handle so touch drag does not fight scrolling", () => {
        renderPanel(2)

        for (const handle of screen.getAllByRole("button", { name: "Drag table" })) {
            expect(handle).toHaveClass("touch-none")
        }
    })

    it("shows an n-of-N position indicator when there is more than one card", () => {
        renderPanel(3)

        expect(screen.getByText("1 of 3")).toBeInTheDocument()
    })

    it("hides the position indicator for a single card", () => {
        renderPanel(1)

        expect(screen.queryByText(/ of /)).not.toBeInTheDocument()
    })
})
