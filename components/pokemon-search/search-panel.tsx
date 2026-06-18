"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Plus, Search } from "lucide-react"
import PokemonInput from "./pokemon-input"
import VersionInput from "./version-input"
import { SubmitEventHandler } from "react"

interface SearchPanelProps {
    pokemonList: any[]
    versionGroupName: string
    setVersionGroupName: (name: string) => void
    pokemonName: string
    setPokemonName: (name: string) => void
    isSubmitting: boolean
    error: string | null
    handleSubmit: SubmitEventHandler
}

export default function SearchPanel({
    pokemonList,
    versionGroupName,
    setVersionGroupName,
    pokemonName,
    setPokemonName,
    isSubmitting,
    error,
    handleSubmit,
}: SearchPanelProps) {
    return (
        <Card className="w-full max-w-md mt-8 mx-auto">
            <CardHeader className="text-center text-2xl font-bold">
                <CardTitle>Enter Pokémon Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <VersionInput
                            value={versionGroupName}
                            onChange={setVersionGroupName}
                        />
                        <PokemonInput
                            pokemonList={pokemonList}
                            value={pokemonName}
                            onChange={setPokemonName}
                        />
                        <Button
                            type="submit"
                            variant="default"
                            disabled={isSubmitting}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add to Panel
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </FieldGroup>
                </form>
                {pokemonName && versionGroupName && (
                    <p className="mt-4 text-sm text-gray-600">
                        Searching for moves of <strong>{pokemonName}</strong> in{" "}
                        <strong>{versionGroupName}</strong>.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
