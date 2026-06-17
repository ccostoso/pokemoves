import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
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
import { Search } from "lucide-react"
import { versionGroupList } from "@/lib/data/versiongroup-list"
import PokemonInput from "./pokemon-input"

export default function SearchPanel() {
    return (
        <Card className="w-full max-w-md mt-8 mx-auto">
            <CardHeader className="text-center text-2xl font-bold">
                <CardTitle>Enter Pokémon Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <FieldGroup>
                        <PokemonInput />
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
                                        {versionGroupList.map((version) => (
                                            <SelectItem
                                                key={version.id}
                                                value={version.apiName}
                                            >
                                                {version.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                Toggle to include different game versions in the
                                search results.
                            </FieldDescription>
                        </Field>
                        <Button type="submit" variant="default">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
