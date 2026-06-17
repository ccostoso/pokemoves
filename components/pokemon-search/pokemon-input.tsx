"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

interface PokemonInputProps {
    pokemonList: { id: number; name: string }[] // Add pokemonList as a prop
    value: string
    onChange: (value: string) => void
}

export default function PokemonInput({
    pokemonList,
    value,
    onChange,
}: PokemonInputProps) {
    return (
        <Field>
            <FieldLabel htmlFor="name">Pokémon Name</FieldLabel>
            <Combobox
                items={pokemonList}
                onValueChange={(val: string | null) => {
                    if (val) onChange(val)
                }}
            >
                <ComboboxInput
                    id="name"
                    autoComplete="off"
                    placeholder="Pikachu"
                    className="w-full"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <ComboboxContent>
                    <ComboboxEmpty>No Pokemon found.</ComboboxEmpty>
                    <ComboboxList>
                        {(pokemon) => (
                            <ComboboxItem key={pokemon.id} value={pokemon.name}>
                                {pokemon.name}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <FieldDescription>
                Enter the name or National Dex number of the Pokémon you want to
                search.
            </FieldDescription>
        </Field>
    )
}
