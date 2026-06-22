import { MovesetItem } from "@/lib/types"
import { getVersionGroupDisplayName } from "@/lib/utils"
import { Button } from "../ui/button"
import { GripVertical, X } from "lucide-react"
import { HTMLAttributes } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import PokemonMovesetTable from "./pokemon-moveset-table"

interface PokemonMovesetCardProps {
    result: MovesetItem | null
    onRemove: () => void
    dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}

export default function PokemonMovesetCard({
    result,
    onRemove,
    dragHandleProps,
}: PokemonMovesetCardProps) {
    const pokemonName =
        result?.pokemonspecies?.[0]?.pokemonspeciesnames?.[0]?.name ||
        result?.pokemon?.[0]?.name ||
        "Unknown"
    const pokemonMoves = result?.pokemon?.[0]?.pokemonmoves || []

    // Get display name for version group
    const versionGroupName = getVersionGroupDisplayName(
        result?.versionGroupName,
    )

    // Construct sprite URLs
    const pokemonSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result?.pokemon?.[0]?.id}.png`

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
                        <PokemonMovesetTable
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
