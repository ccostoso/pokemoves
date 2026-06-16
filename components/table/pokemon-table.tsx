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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Version</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>Name</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Move</TableHead>
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
    )
}
