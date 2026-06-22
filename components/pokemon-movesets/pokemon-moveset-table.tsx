import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import TypeSprite from "../type-sprite"

interface Move {
    level: number
    move: {
        type: {
            name: string
        }
        movenames: { name: string }[]
    }
}

interface PokemonMovesTableProps {
    pokemonName: string
    versionGroupName: string
    pokemonMoves: Move[]
    pokemonSpriteUrl: string
}

export default function PokemonMovesTable({
    pokemonName,
    versionGroupName,
    pokemonMoves,
    pokemonSpriteUrl,
}: PokemonMovesTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={3} className="text-center">
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
                        <TableCell>{move.move.movenames[0]?.name}</TableCell>
                        <TableCell>
                            {move.move.type.name && (
                                <TypeSprite typeName={move.move.type.name} />
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
