"use client"

import { useMemo, useState } from "react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { getPokemonDisplayName } from "@/lib/utils"
import { PokemonListItem } from "@/lib/types"

type PokemonInputProps = {
    pokemonList: PokemonListItem[],
    value: string,
    onChange: (value: string) => void
}

export default function PokemonInput({
    pokemonList,
    value,
    onChange,
}: PokemonInputProps) {
    const canonicalToDisplay = useMemo(
        () =>
            new Map(
                pokemonList.map((pokemon) => [
                    pokemon.name,
                    getPokemonDisplayName(pokemon),
                ]),
            ),
        [pokemonList],
    )

    const [inputText, setInputText] = useState(
        canonicalToDisplay.get(value) ?? value,
    )

    return (
        <Field>
            <FieldLabel htmlFor="name">Pokémon Name</FieldLabel>
            <Combobox
                items={pokemonList}
                onValueChange={(canonicalName: string | null) => {
                    if (!canonicalName) return
                    setInputText(
                        canonicalToDisplay.get(canonicalName) ?? canonicalName,
                    )
                    onChange(canonicalName)
                }}
            >
                <ComboboxInput
                    id="name"
                    autoComplete="off"
                    placeholder="Enter Pokémon name"
                    className="w-full"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <ComboboxContent>
                    <ComboboxEmpty>No Pokemon found.</ComboboxEmpty>
                    <ComboboxList>
                        {(pokemon) => (
                            <ComboboxItem key={pokemon.id} value={pokemon.name}>
                                {getPokemonDisplayName(pokemon)}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <FieldDescription>
                Enter the name of the Pokémon to look up.
            </FieldDescription>
        </Field>
    )
}
