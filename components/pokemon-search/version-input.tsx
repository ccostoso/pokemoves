import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { versionGroupList } from "@/lib/data/versiongroup-list"

interface VersionInputProps {
    value: string
    onChange: (value: string) => void
}

export default function VersionInput({ value, onChange }: VersionInputProps) {
    return (
        <Field>
            <FieldLabel htmlFor="include-forms">Game Version</FieldLabel>
            <Select value={value} onValueChange={onChange}>
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
                Toggle to include different game versions in the search results.
            </FieldDescription>
        </Field>
    )
}
