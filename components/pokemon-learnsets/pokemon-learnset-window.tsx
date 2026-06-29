import { LevelUpLearnset } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerPokemonLearnsetToolbar, ViewerPokemonLearnsetToolbar, NewPokemonLearnsetToolbar } from "./pokemon-learnset-toolbar"

type PokemonLearnsetWindowProps = {
    learnsetList: LevelUpLearnset[],
    onRemoveLearnset: (index: number) => void,
    onReorderLearnset: (fromIndex: number, toIndex: number) => void
}

const TOOLBAR_TYPE: "owner" | "viewer" | "new" = "owner"

export default function PokemonLearnsetWindow({
    learnsetList,
    onRemoveLearnset,
    onReorderLearnset,
}: PokemonLearnsetWindowProps) {
    return (
        <div className="flex flex-col border rounded-xl">
            {TOOLBAR_TYPE === "owner" && <OwnerPokemonLearnsetToolbar />}
            {TOOLBAR_TYPE === "viewer" && <ViewerPokemonLearnsetToolbar />}
            {TOOLBAR_TYPE === "new" && <NewPokemonLearnsetToolbar />}
            <PokemonLearnsetPanel
                learnsetList={learnsetList}
                onRemoveLearnset={onRemoveLearnset}
                onReorderLearnset={onReorderLearnset}
            />
        </div>
    )
}