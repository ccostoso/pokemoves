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
import { pokemonList } from "@/lib/data/pokemon-list"

export default function PokemonInput() {
    return (
        <Field>
            <FieldLabel htmlFor="name">Pokémon Name</FieldLabel>
            <Combobox items={pokemonList}>
                <ComboboxInput
                    id="name"
                    autoComplete="off"
                    placeholder="Pikachu"
                    className="w-full"
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
