"use client"

import { SubmitEventHandler, useEffect, useState } from "react"
import SearchPanel from "./pokemon-search/search-panel"
import PokemonMovesPanel from "./table/pokemon-moves-panel"
import { useLevelUpMovesByPokemonNameAndGeneration } from "@/lib/use-search"
import {
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndGeneration,
} from "@/lib/actions"
import { queryResult } from "@/lib/types"

export default function SearchShell() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { revalidateMoves } = useLevelUpMovesByPokemonNameAndGeneration(
        "",
        "",
    ) // Initialize with empty values

    const [pokemonList, setPokemonList] = useState<any[]>([])
    const [versionGroupName, setVersionGroupName] = useState("")
    const [pokemonName, setPokemonName] = useState("")
    const [resultArr, setResultArr] = useState<queryResult[]>([])

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
            // setResult(pokemonMoves)
            // Push new result to resultArr
            console.log("pokemonMoves:", pokemonMoves) // Debugging log
            setResultArr((prev) => [...prev, pokemonMoves])

            revalidateMoves()
        } catch (err) {
            setError("An error occurred while searching. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <section id="search" className="mt-8 max-w-2xl mx-auto">
                <SearchPanel
                    pokemonList={pokemonList}
                    versionGroupName={versionGroupName}
                    setVersionGroupName={setVersionGroupName}
                    pokemonName={pokemonName}
                    setPokemonName={setPokemonName}
                    isSubmitting={isSubmitting}
                    error={error}
                    handleSubmit={handleSubmit}
                />
            </section>
            <section id="results" className="mt-8 overflow-x-auto">
                <PokemonMovesPanel resultArr={resultArr} />
            </section>
        </>
    )
}
