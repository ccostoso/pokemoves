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
import { Spinner } from "../ui/spinner"

type PokemonInputProps = {
    pokemonList: PokemonListItem[],
    value: string,
    onChange: (value: string) => void,
    pokemonListLoading?: boolean
}

export default function PokemonInput({ pokemonList, value, onChange, pokemonListLoading = false }: PokemonInputProps) {
    const apiToDisplay = useMemo(
        () => new Map(pokemonList.map((pokemon) => [pokemon.name, getPokemonDisplayName(pokemon)])),
        [pokemonList],
    )

    const [inputText, setInputText] = useState(apiToDisplay.get(value) ?? value)

    return (
        <Field>
            <FieldLabel htmlFor="name">Pokémon Name</FieldLabel>
            <Combobox
                items={ pokemonList }
                onValueChange={ (apiName: string | null) => {
                    if (!apiName) return
                    setInputText(apiToDisplay.get(apiName) ?? apiName)
                    onChange(apiName)
                } }
            >
                <ComboboxInput
                    id="name"
                    autoComplete="off"
                    placeholder="Enter Pokémon name"
                    className="w-full"
                    disabled={ pokemonListLoading }
                    value={ inputText }
                    onChange={ (e) => setInputText(e.target.value) }
                />
                <ComboboxContent>
                    { pokemonListLoading ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                            <Spinner className="size-4" />
                            Loading Pokemon...
                        </div>
                    ) : (
                        <>
                            <ComboboxEmpty>No Pokemon found.</ComboboxEmpty>
                            <ComboboxList>
                                { (pokemon) => (
                                    <ComboboxItem key={ pokemon.id } value={ pokemon.name }>
                                        { getPokemonDisplayName(pokemon) }
                                    </ComboboxItem>
                                ) }
                            </ComboboxList>
                        </>
                    ) }
                </ComboboxContent>
            </Combobox>
            <FieldDescription>
                { pokemonListLoading ? (
                    <span className="inline-flex items-center gap-2">
                        <Spinner className="size-4" />
                        Loading Pokemon list...
                    </span>
                ) : (
                    "Enter the name of the Pokémon to look up."
                ) }
            </FieldDescription>
        </Field>
    )
}
