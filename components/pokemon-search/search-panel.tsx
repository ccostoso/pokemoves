"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus } from "lucide-react"
import PokemonInput from "./pokemon-input"
import VersionInput from "./version-input"
import { SubmitEventHandler, useId } from "react"
import { cn, getPokemonDisplayName, getVersionGroupDisplayName } from "@/lib/utils"
import { PokemonListItem } from "@/lib/types"

type SearchPanelProps = {
    pokemonList: PokemonListItem[],
    versionGroupName: string,
    setVersionGroupName: (name: string) => void,
    pokemonName: string,
    setPokemonName: (name: string) => void,
    isSubmitting: boolean,
    pokemonListLoading: boolean,
    error: string | null,
    handleAddLearnsetToLearnsetDeck: SubmitEventHandler<HTMLFormElement>,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

export default function SearchPanel({
    pokemonList,
    versionGroupName,
    setVersionGroupName,
    pokemonName,
    setPokemonName,
    isSubmitting,
    pokemonListLoading,
    error,
    handleAddLearnsetToLearnsetDeck,
    open,
    onOpenChange,
}: SearchPanelProps) {
    const selectedPokemon = pokemonList.find((pokemon) => pokemon.name === pokemonName)
    const pokemonDisplayName = selectedPokemon ? getPokemonDisplayName(selectedPokemon) : pokemonName
    const versionGroupDisplayName = getVersionGroupDisplayName(versionGroupName)
    const selectionSummary = [pokemonDisplayName, versionGroupDisplayName].filter(Boolean).join(" · ")
    const contentId = useId()

    return (
        <Collapsible open={ open } onOpenChange={ onOpenChange }>
            <Card className="w-full">
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        aria-controls={ contentId }
                        className="group/trigger flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left md:hidden"
                    >
                        <span className="min-w-0">
                            <span className="block text-base font-bold">Enter Pokémon Details</span>
                            { selectionSummary && !open && (
                                <span className="block truncate text-sm text-muted-foreground">{ selectionSummary }</span>
                            ) }
                        </span>
                        <ChevronDown className="size-5 shrink-0 transition-transform group-data-[state=open]/trigger:rotate-180" />
                    </button>
                </CollapsibleTrigger>
                <CardHeader className="hidden text-center text-2xl font-bold md:block">
                    <CardTitle>Enter Pokémon Details</CardTitle>
                </CardHeader>
                { /* Plain div instead of CollapsibleContent: Radix unmounts children while closed, but the panel must stay visible at md+ */ }
                <div id={ contentId } className={ cn(!open && "max-md:hidden") }>
                    <CardContent>
                        <form onSubmit={ handleAddLearnsetToLearnsetDeck }>
                            <FieldGroup>
                                <VersionInput value={ versionGroupName } onChange={ setVersionGroupName } />
                                <PokemonInput
                                    key={ versionGroupName }
                                    pokemonList={ pokemonList }
                                    value={ pokemonName }
                                    onChange={ setPokemonName }
                                    pokemonListLoading={ pokemonListLoading }
                                />
                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={ isSubmitting || pokemonList.length === 0 || !versionGroupName || !pokemonName }
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add to Panel
                                </Button>
                                { error && <p className="text-red-500 mt-2">{ error }</p> }
                            </FieldGroup>
                        </form>
                        { pokemonName && versionGroupName && (
                            <p className="mt-4 text-sm text-gray-600">
                                Searching for moves of <strong>{ pokemonDisplayName }</strong> in <strong>{ versionGroupDisplayName }</strong>.
                            </p>
                        ) }
                    </CardContent>
                </div>
            </Card>
        </Collapsible>
    )
}
