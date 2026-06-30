import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import PokemonLearnsetPanel from "./pokemon-learnset-panel"
import { OwnerLearnsetToolbar, ViewerLearnsetToolbar, NewLearnsetToolbar } from "./toolbars"

type PokemonLearnsetWindowProps = {
    toolbarType: "owner" | "viewer" | "new" | "none",
    learnsetList: LevelUpLearnset[],
    onClearLearnsets: () => void,
    onRemoveLearnset: (index: number) => void,
    onReorderLearnset: (fromIndex: number, toIndex: number) => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean,
    learnsetDeckName?: string | null
}

export default function PokemonLearnsetWindow({
    toolbarType,
    learnsetList,
    onClearLearnsets,
    onRemoveLearnset,
    onReorderLearnset,
    pokemonList,
    isSubmitting,
    learnsetDeckName
}: PokemonLearnsetWindowProps) {
    if (toolbarType === "none") {
        return null
    }

    return (
        <div className="flex flex-col border rounded-xl">
            { toolbarType === "owner" && <OwnerLearnsetToolbar learnsetDeckName={ learnsetDeckName } /> }
            { toolbarType === "viewer" && <ViewerLearnsetToolbar learnsetDeckName={ learnsetDeckName } /> }
            { toolbarType === "new" && <NewLearnsetToolbar
                learnsetList={ learnsetList }
                handleClearLearnsets={ onClearLearnsets }
                pokemonList={ pokemonList }
                isSubmitting={ isSubmitting } /> }
            <PokemonLearnsetPanel
                learnsetList={ learnsetList }
                onRemoveLearnset={ onRemoveLearnset }
                onReorderLearnset={ onReorderLearnset }
            />
        </div>
    )
}