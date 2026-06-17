import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "../ui/table"

export default function PokemonTable() {
    return (
        <div className="flex flex-nowrap justify-center gap-4 pb-2">
            <div className="basis-1/4 shrink-0 min-w-72">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">
                                Version
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">
                                Name
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className="text-center">Level</TableHead>
                            <TableHead className="text-center">Move</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Electric</TableCell>
                            <TableCell>Static, Lightning Rod</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Grass/Poison</TableCell>
                            <TableCell>Overgrow, Chlorophyll</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
