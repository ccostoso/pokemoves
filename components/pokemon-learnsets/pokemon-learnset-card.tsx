import { LevelUpLearnset } from "@/lib/types"
import { getVersionGroupDisplayName } from "@/lib/utils"
import { Button } from "../ui/button"
import { GripVertical, X } from "lucide-react"
import { HTMLAttributes } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import PokemonLearnsetTable from "./pokemon-learnset-table"

interface PokemonLearnsetCardProps {
    item: LevelUpLearnset | null
    onRemove: () => void
    dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}

export default function PokemonLearnsetCard({
    item,
    onRemove,
    dragHandleProps,
}: PokemonLearnsetCardProps) {
    const pokemonName =
        item?.pokemon?.[0]?.pokemonspecy?.pokemonspeciesnames?.[0]?.name ||
        item?.pokemon?.[0]?.name ||
        "Unknown"
    const pokemonMoves = item?.pokemon?.[0]?.pokemonmoves || []

    // Get display name for version group
    const versionGroupName = getVersionGroupDisplayName(item?.versionGroupName)

    // Construct sprite URLs
    const pokemonSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item?.pokemon?.[0]?.id}.png`

    return (
        <div className="basis-1/4 shrink-0 min-w-72">
            <Card className="relative p-4">
                <CardHeader className="absolute inset-0 p-0 h-0 overflow-visible">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 left-4 z-10 cursor-grab active:cursor-grabbing"
                        aria-label="Drag table"
                        {...dragHandleProps}
                    >
                        <GripVertical className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-10"
                        onClick={onRemove}
                        aria-label="Remove table"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-xl">
                        <PokemonLearnsetTable
                            pokemonName={pokemonName}
                            versionGroupName={versionGroupName}
                            pokemonMoves={pokemonMoves}
                            pokemonSpriteUrl={pokemonSpriteUrl}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
