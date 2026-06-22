"use client"

import { SubmitEventHandler, useEffect, useState } from "react"
import SearchPanel from "./pokemon-search/search-panel"
import PokemonMovesetPanel from "./pokemon-movesets/pokemon-moveset-panel"
import {
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndGeneration,
    PokemonListItem,
} from "@/lib/actions"
import { QueryResult } from "@/lib/types"

export default function SearchShell() {
    // const [isSubmitting, setIsSubmitting] = useState(false)
    // const [error, setError] = useState<string | null>(null)

    type RequestState =
        | { status: "idle" }
        | { status: "loading" }
        | { status: "error"; message: string }

    const [requestState, setRequestState] = useState<RequestState>({
        status: "idle",
    })

    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([])
    const [versionGroupName, setVersionGroupName] = useState("")
    const [pokemonName, setPokemonName] = useState("")
    const [resultArr, setResultArr] = useState<QueryResult[]>([])

    useEffect(() => {
        if (!versionGroupName) {
            setPokemonList([])
            return
        }

        // To prevent state updates on unmounted component
        let cancelled = false

        console.log(versionGroupName) // Debugging log

        const loadPokemon = async () => {
            try {
                const pokemon =
                    await getAllPokemonByVersionGroupName(versionGroupName)
                if (!cancelled) {
                    setPokemonList(pokemon)
                }
                if (pokemon.length === 0) {
                    setPokemonList([])
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
        setRequestState({ status: "loading" })

        try {
            const pokemonMoves =
                await getLevelUpMovesByPokemonNameAndGeneration(
                    pokemonName,
                    versionGroupName,
                )
            // setResult(pokemonMoves)
            // Push new result to resultArr
            console.log("pokemonMoves:", pokemonMoves) // Debugging log
            setResultArr((prev) => [
                { ...pokemonMoves, id: crypto.randomUUID() },
                ...prev,
            ])

            // revalidateMoves()
            setRequestState({ status: "idle" })
        } catch (err) {
            setRequestState({
                status: "error",
                message: "An error occurred while searching. Please try again.",
            })
        }
    }

    const handleRemoveResult = (indexToRemove: number) => {
        setResultArr((prev) =>
            prev.filter((_, index) => index !== indexToRemove),
        )
    }

    const handleReorderResult = (fromIndex: number, toIndex: number) => {
        setResultArr((prev) => {
            // Create a copy of the array to avoid mutating state directly
            const next = [...prev]

            // Remove the item from its original position
            // splice() returns an array of removed items, so we take the first one using destructuring
            const [moved] = next.splice(fromIndex, 1)

            // Adjust toIndex if the item is moved forward in the array
            next.splice(toIndex, 0, moved)
            return next
        })
    }

    return (
        <>
            <div className="flex gap-6 mt-6">
                <aside className="w-72 shrink-0">
                    <SearchPanel
                        pokemonList={pokemonList}
                        versionGroupName={versionGroupName}
                        setVersionGroupName={setVersionGroupName}
                        pokemonName={pokemonName}
                        setPokemonName={setPokemonName}
                        isSubmitting={requestState.status === "loading"}
                        error={
                            requestState.status === "error"
                                ? requestState.message
                                : null
                        }
                        handleSubmit={handleSubmit}
                    />
                </aside>
                <section className="flex-1 overflow-x-auto ">
                    <PokemonMovesetPanel
                        resultArr={resultArr}
                        onRemoveResult={handleRemoveResult}
                        onReorderResult={handleReorderResult}
                    />
                </section>
            </div>
        </>
    )
}
