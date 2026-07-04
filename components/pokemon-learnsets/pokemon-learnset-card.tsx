import { LevelUpLearnset } from "@/lib/types"
import { getVersionGroupDisplayName } from "@/lib/utils"
import { Button } from "../ui/button"
import { GripVertical, X } from "lucide-react"
import { HTMLAttributes } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import PokemonLearnsetTable from "./pokemon-learnset-table"
import Image from "next/image"

type PokemonLearnsetCardProps = {
    item: LevelUpLearnset | null,
    onRemove: () => void,
    dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}

export default function PokemonLearnsetCard({ item, onRemove, dragHandleProps }: PokemonLearnsetCardProps) {
    const pokemonName = item?.pokemon?.[0]?.species?.names?.[0]?.name || item?.pokemon?.[0]?.name || "Unknown"
    const pokemonMoves = item?.pokemon?.[0]?.pokemonmoves || []

    // Get display name for version group
    const versionGroupName = getVersionGroupDisplayName(item?.versionGroupName)

    // Construct sprite URLs
    const pokemonSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item?.pokemon?.[0]?.id}.png`

    return (
        <div className="basis-1/4 shrink-0 min-w-72">
            <Card className="m-0 p-0 gap-0">
                <CardHeader className="flex items-start justify-center gap-2 relative p-4">
                    <div className="">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 left-4 z-10 cursor-grab active:cursor-grabbing"
                            aria-label="Drag table"
                            { ...dragHandleProps }
                        >
                            <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10"
                            onClick={ onRemove }
                            aria-label="Remove table"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        { pokemonSpriteUrl && (
                            <Image
                                src={ pokemonSpriteUrl }
                                alt={ pokemonName }
                                className="mx-auto"
                                width={ 96 }
                                height={ 96 }
                            />
                        ) }
                        <div className="flex flex-col items-center justify-center gap-1">
                            <h3 className="text-lg font-semibold">{ pokemonName }</h3>
                            <p className="text-sm text-muted-foreground">{ versionGroupName }</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden">
                        <PokemonLearnsetTable pokemonMoves={ pokemonMoves } />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
