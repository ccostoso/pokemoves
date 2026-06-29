import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TypeSprite from "../type-sprite"

type Move = {
    level: number,
    move: {
        type: {
            name: string
        },
        movenames: { name: string }[]
    }
}

type PokemonLearnsetTableProps = {
    pokemonMoves: Move[]
}

export default function PokemonLearnsetTable({
    pokemonMoves,
}: PokemonLearnsetTableProps) {
    return (
        <Table>
            <TableHeader className="border-t-2">
                <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="text-center font-bold text-xs">LEVEL</TableHead>
                    <TableHead className="font-bold text-xs">MOVE</TableHead>
                    <TableHead className="text-center font-bold text-xs">TYPE</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pokemonMoves.map((move: Move) => (
                    <TableRow
                        key={`${move.move.movenames[0]?.name}-${move.level}`}
                    >
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
