import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TypeSprite from "../type-sprite"

type Move = {
    level: number,
    move: {
        name: string,
        type: {
            name: string
        },
        movenames: { name: string }[]
    }
}

type PokemonLearnsetTableProps = {
    pokemonMoves: Move[]
}

export default function PokemonLearnsetTable({ pokemonMoves }: PokemonLearnsetTableProps) {
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
                { pokemonMoves.map((move: Move, index: number) => {
                    const displayName = move.move.movenames[0]?.name
                    const apiName = move.move.name
                    const viewedName = displayName ?? apiName ?? "Unknown move"
                    const keyBase = displayName ?? apiName

                    return (
                        <TableRow key={ keyBase ? `${keyBase}-${move.level}` : `unknown-${move.level}-${index}` }>
                            <TableCell className="text-center">{ move.level }</TableCell>
                            <TableCell>{ viewedName }</TableCell>
                            <TableCell>{ move.move.type.name && <TypeSprite typeName={ move.move.type.name } /> }</TableCell>
                        </TableRow>
                    )
                }) }
            </TableBody>
        </Table>
    )
}
