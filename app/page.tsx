import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react"

export default async function Home() {
    async function getExternalData() {
        const apiKey = process.env.EXTERNAL_API_KEY // Safe from client exposure

        const response = await fetch("https://example.com", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            // Next.js specific caching options:
            next: { revalidate: 3600 }, // Cache data for 1 hour (3600 seconds)
        })

        if (!response.ok) {
            throw new Error("Failed to fetch external API data")
        }

        return response.json()
    }

    return (
        <main className="container mx-auto p-4 flex-1">
            <h1 className="text-4xl font-bold">Pokémon Move Comparison</h1>
            {/* <section id="search" className="mt-8 max-w-2xl mx-auto"> */}
            <Card className="w-full max-w-md mt-8 mx-auto">
                <CardHeader className="text-center text-2xl font-bold">
                    <CardTitle>Enter Pokémon Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* <FieldSet> */}
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Pokémon Name
                                </FieldLabel>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="Pikachu"
                                />
                                <FieldDescription>
                                    Enter the name or National Dex number of the
                                    Pokémon you want to search.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="include-forms">
                                    Game Version
                                </FieldLabel>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a version" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="red-blue">
                                                Red/Blue
                                            </SelectItem>
                                            <SelectItem value="yellow">
                                                Yellow
                                            </SelectItem>
                                            <SelectItem value="gold-silver">
                                                Gold/Silver
                                            </SelectItem>
                                            <SelectItem value="crystal">
                                                Crystal
                                            </SelectItem>
                                            <SelectItem value="ruby-sapphire">
                                                Ruby/Sapphire
                                            </SelectItem>
                                            <SelectItem value="emerald">
                                                Emerald
                                            </SelectItem>
                                            <SelectItem value="fire-red-leaf-green">
                                                FireRed/LeafGreen
                                            </SelectItem>
                                            <SelectItem value="diamond-pearl">
                                                Diamond/Pearl
                                            </SelectItem>
                                            <SelectItem value="platinum">
                                                Platinum
                                            </SelectItem>
                                            <SelectItem value="heart-gold-soul-silver">
                                                HeartGold/SoulSilver
                                            </SelectItem>
                                            <SelectItem value="black-white">
                                                Black/White
                                            </SelectItem>
                                            <SelectItem value="black-2-white-2">
                                                Black 2/White 2
                                            </SelectItem>
                                            <SelectItem value="x-y">
                                                X/Y
                                            </SelectItem>
                                            <SelectItem value="omega-ruby-alpha-sapphire">
                                                Omega Ruby/Alpha Sapphire
                                            </SelectItem>
                                            <SelectItem value="sun-moon">
                                                Sun/Moon
                                            </SelectItem>
                                            <SelectItem value="ultra-sun-ultra-moon">
                                                Ultra Sun/Ultra Moon
                                            </SelectItem>
                                            <SelectItem value="lets-go-pikachu-lets-go-eevee">
                                                Let&apos;s Go Pikachu/Let&apos;s
                                                Go Eevee
                                            </SelectItem>
                                            <SelectItem value="sword-shield">
                                                Sword/Shield
                                            </SelectItem>
                                            <SelectItem value="brilliant-diamond-shining-pearl">
                                                Brilliant Diamond/Shining Pearl
                                            </SelectItem>
                                            <SelectItem value="legends-arceus">
                                                Legends: Arceus
                                            </SelectItem>
                                            <SelectItem value="scarlet-violet">
                                                Scarlet/Violet
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldDescription>
                                    Toggle to include different game versions in
                                    the search results.
                                </FieldDescription>
                            </Field>
                            <Button
                                type="submit"
                                variant="default"
                                // className="mt-[27.25px]"
                            >
                                <Search className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </FieldGroup>
                    </form>
                    {/* </FieldSet> */}
                </CardContent>
            </Card>
            {/* </section> */}
            <section id="results" className="mt-8 overflow-x-auto">
                <div className="flex flex-nowrap justify-center gap-4 pb-2">
                    <div className="basis-1/4 shrink-0 min-w-72">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        colSpan={2}
                                        className="text-center"
                                    >
                                        Version
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead
                                        colSpan={2}
                                        className="text-center"
                                    >
                                        Name
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Level
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Move
                                    </TableHead>
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
            </section>
        </main>
    )
}
