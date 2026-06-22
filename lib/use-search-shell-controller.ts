import { getAllPokemonByVersionGroupName, getLevelUpMovesByPokemonNameAndGeneration, PokemonListItem } from "./actions";
import { QueryResult } from "./types";
import { SubmitEventHandler, useEffect, useState } from "react"

type RequestState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }

type UseSearchShellControllerReturn = {
    // form state
    pokemonList: PokemonListItem[]
    versionGroupName: string
    pokemonName: string

    // result state
    resultArr: QueryResult[]

    // request/derived UI state
    isSubmitting: boolean
    error: string | null

    // setters used by SearchPanel inputs
    setVersionGroupName: (name: string) => void
    setPokemonName: (name: string) => void

    // handlers used by child components
    handleSubmit: SubmitEventHandler<HTMLFormElement>
    handleRemoveResult: (indexToRemove: number) => void
    handleReorderResult: (fromIndex: number, toIndex: number) => void
}

export function useSearchShellController(): UseSearchShellControllerReturn {
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
        setRequestState({ status: "loading" })

        try {
            const pokemonMoves =
                await getLevelUpMovesByPokemonNameAndGeneration(
                    pokemonName,
                    versionGroupName,
                )

            // Push new result to resultArr
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

    return {
        pokemonList,
        versionGroupName,
        pokemonName,
        resultArr,
        isSubmitting: requestState.status === "loading",
        error:
            requestState.status === "error" ? requestState.message : null,
        setVersionGroupName,
        setPokemonName,
        handleSubmit,
        handleRemoveResult,
        handleReorderResult,
    }
}