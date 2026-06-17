"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Search } from "lucide-react"
import PokemonInput from "./pokemon-input"
import VersionInput from "./version-input"
import { SubmitEventHandler, useEffect, useState } from "react"
import { useLevelUpMovesByPokemonNameAndGeneration } from "@/lib/use-search"
import {
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndGeneration,
} from "@/lib/actions"

export default function SearchPanel() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { revalidateMoves } = useLevelUpMovesByPokemonNameAndGeneration(
        "",
        "",
    ) // Initialize with empty values

    const [pokemonList, setPokemonList] = useState([])
    const [versionGroupName, setVersionGroupName] = useState("")
    const [pokemonName, setPokemonName] = useState("")
    const [moves, setMoves] = useState([])

    useEffect(() => {
        if (!versionGroupName) {
            setPokemonList([])
            return
        }

        // To prevent state updates on unmounted component
        let cancelled = false

        const loadPokemon = async () => {
            try {
                const pokemon =
                    await getAllPokemonByVersionGroupName(versionGroupName)
                if (!cancelled) {
                    setPokemonList(pokemon)
                }
            } catch (err) {
                console.error("Error fetching Pokémon by version group:", err)
                if (!cancelled) {
                    setPokemonList([])
                }
            }
        }

        loadPokemon()

        return () => {
            cancelled = true
        }
    }, [versionGroupName])

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const pokemonMoves =
                await getLevelUpMovesByPokemonNameAndGeneration(
                    pokemonName,
                    versionGroupName,
                )
            setMoves(pokemonMoves)
            revalidateMoves()
        } catch (err) {
            setError("An error occurred while searching. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

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
                            <Search className="mr-2 h-4 w-4" /> Search
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
                {moves.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Moves:</h3>
                        <ul className="list-disc list-inside">
                            {moves.map((move: any, index: number) => (
                                <li key={index}>
                                    Level {move.level}: {move.move.name} (Type:{" "}
                                    {move.move.type.name})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
