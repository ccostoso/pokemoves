import { queryResult } from "@/lib/types"
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "../ui/table"

interface PokemonTableProps {
    result: queryResult | null
    pokemonName: string
    versionGroupName: string
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

export default function PokemonTable({
    result,
    pokemonName,
    versionGroupName,
}: PokemonTableProps) {
    console.log("Moves in PokemonTable:", result) // Debugging log
    const pokemonmoves = result?.pokemon?.[0]?.pokemonmoves || []
    console.log("Extracted pokemonmoves:", pokemonmoves) // Debugging log
    return (
        <div className="flex flex-nowrap justify-center gap-4 pb-2">
            <div className="basis-1/4 shrink-0 min-w-72">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">
                                Version Group:{" "}
                                <strong>{versionGroupName}</strong>
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">
                                Name: <strong>{pokemonName}</strong>
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className="text-center">Level</TableHead>
                            <TableHead className="text-center">Move</TableHead>
                            <TableHead className="text-center">Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pokemonmoves.map((move: Move, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">
                                    {move.level}
                                </TableCell>
                                <TableCell>
                                    {move.move.movenames[0]?.name}
                                </TableCell>
                                <TableCell>{move.move.type.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
