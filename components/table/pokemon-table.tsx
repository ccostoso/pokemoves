import { queryResult } from "@/lib/types"
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "../ui/table"
import { getTypeNumber, getVersionGroupDisplayName } from "@/lib/utils"
import Image from "next/image"
import { Button } from "../ui/button"
import { X } from "lucide-react"

interface PokemonTableProps {
    result: queryResult | null
    onRemove: () => void
}

interface Move {
    level: number
    move: {
        type: {
            name: string
        }
        movenames: { name: string }[]
    }
}

function TypeSprite({ typeName }: { typeName: string }) {
    const typeNumber = getTypeNumber(typeName)
    const typeSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/types/generation-vii/sun-moon/${typeNumber}.png`

    return (
        <Image
            src={typeSpriteUrl}
            alt={typeName}
            className="mx-auto"
            width={48}
            height={48}
        />
    )
}

export default function PokemonTable({ result, onRemove }: PokemonTableProps) {
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead colSpan={3} className="relative text-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1"
                                onClick={onRemove}
                                aria-label="Remove table"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            {pokemonSpriteUrl && (
                                <Image
                                    src={pokemonSpriteUrl}
                                    alt={pokemonName}
                                    className="mx-auto"
                                    width={96}
                                    height={96}
                                />
                            )}
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead colSpan={3} className="text-center">
                            <strong>{pokemonName}</strong>
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead colSpan={3} className="text-center">
                            <strong>{versionGroupName}</strong>
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-center">Level</TableHead>
                        <TableHead className="text-center">Move</TableHead>
                        <TableHead className="text-center">Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pokemonMoves.map((move: Move, index: number) => (
                        <TableRow key={index}>
                            <TableCell className="text-center">
                                {move.level}
                            </TableCell>
                            <TableCell>
                                {move.move.movenames[0]?.name}
                            </TableCell>
                            <TableCell>
                                {move.move.type.name && (
                                    <TypeSprite
                                        typeName={move.move.type.name}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
