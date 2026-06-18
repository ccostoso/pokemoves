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

type PokemonName = {
    id: number
    name: string
    pokemonspecy: {
        pokemonspeciesnames: {
            name: string
        }[]
    }
}

interface PokemonInputProps {
    pokemonList: PokemonName[]
    value: string
    onChange: (value: string) => void
}

export default function PokemonInput({
    pokemonList,
    value,
    onChange,
}: PokemonInputProps) {
    const [inputText, setInputText] = useState(value)

    // Map formatted display name → canonical name used in GraphQL queries
    const displayToCanonical = useMemo(
        () =>
            new Map(
                pokemonList.map((p) => [
                    p.pokemonspecy.pokemonspeciesnames[0]?.name ?? p.name,
                    p.name,
                ]),
            ),
        [pokemonList],
    )

    return (
        <Field>
            <FieldLabel htmlFor="name">Pokémon Name</FieldLabel>
            <Combobox
                items={pokemonList}
                onValueChange={(displayName: string | null) => {
                    if (!displayName) return
                    setInputText(displayName)
                    onChange(displayToCanonical.get(displayName) ?? displayName)
                }}
            >
                <ComboboxInput
                    id="name"
                    autoComplete="off"
                    placeholder="Pikachu"
                    className="w-full"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <ComboboxContent>
                    <ComboboxEmpty>No Pokemon found.</ComboboxEmpty>
                    <ComboboxList>
                        {(pokemon) => {
                            const displayName =
                                pokemon.pokemonspecy.pokemonspeciesnames[0]
                                    ?.name ?? pokemon.name
                            return (
                                <ComboboxItem
                                    key={pokemon.id}
                                    value={displayName}
                                >
                                    {displayName}
                                </ComboboxItem>
                            )
                        }}
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
