import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerPokemonLearnsetToolbar, ViewerPokemonLearnsetToolbar, NewPokemonLearnsetToolbar } from "./pokemon-learnset-toolbar"

type PokemonLearnsetWindowProps = {
    learnsetList: LevelUpLearnset[],
    onClearLearnsets: () => void,
    onRemoveLearnset: (index: number) => void,
    onReorderLearnset: (fromIndex: number, toIndex: number) => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
    
}

const TOOLBAR_TYPE: "owner" | "viewer" | "new" | "none" = "owner"

export default function PokemonLearnsetWindow({
    learnsetList,
    onClearLearnsets,
    onRemoveLearnset,
    onReorderLearnset,
    pokemonList,
    isSubmitting
}: PokemonLearnsetWindowProps) {
    return (
        <div className="flex flex-col border rounded-xl">
            {TOOLBAR_TYPE === "owner" && <OwnerPokemonLearnsetToolbar />}
            {TOOLBAR_TYPE === "viewer" && <ViewerPokemonLearnsetToolbar />}
            {TOOLBAR_TYPE === "new" && <NewPokemonLearnsetToolbar
                learnsetList={learnsetList}
                handleClearLearnsets={onClearLearnsets}
                pokemonList={pokemonList}
                isSubmitting={isSubmitting} />}
            <PokemonLearnsetPanel
                learnsetList={learnsetList}
                onRemoveLearnset={onRemoveLearnset}
                onReorderLearnset={onReorderLearnset}
            />
        </div>
    )
}