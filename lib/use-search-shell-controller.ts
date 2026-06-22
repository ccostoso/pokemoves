import { getAllPokemonByVersionGroupName, getLevelUpMovesByPokemonNameAndGeneration, PokemonListItem } from "./actions";
import { QueryResult } from "./types";
import { SubmitEventHandler, useEffect, useReducer, useState } from "react"

type RequestState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }

type SearchShellState = {
    pokemonList: PokemonListItem[]
    versionGroupName: string
    pokemonName: string
    resultArr: QueryResult[]
    requestState: RequestState
}

type SearchShellAction =
    | { type: "versionGroupChanged"; versionGroupName: string }
    | { type: "pokemonNameChanged"; pokemonName: string }
    | { type: "pokemonListLoaded"; pokemonList: PokemonListItem[] }
    | { type: "pokemonListFailed" }
    | { type: "submitStarted" }
    | { type: "submitSucceeded"; result: QueryResult }
    | { type: "submitFailed"; message: string }
    | { type: "resultRemoved"; indexToRemove: number }
    | { type: "resultReordered"; fromIndex: number; toIndex: number }

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

function searchShellReducer(
    state: SearchShellState,
    action: SearchShellAction,
): SearchShellState {
    switch (action.type) {
        case "versionGroupChanged":
            return {
                ...state,
                versionGroupName: action.versionGroupName,
                pokemonList: [],
            }

        case "pokemonNameChanged":
            return {
                ...state,
                pokemonName: action.pokemonName,
            }

        case "pokemonListLoaded":
            return {
                ...state,
                pokemonList: action.pokemonList,
            }

        case "pokemonListFailed":
            return {
                ...state,
                pokemonList: [],
            }

        case "submitStarted":
            return {
                ...state,
                requestState: { status: "loading" },
            }

        case "submitSucceeded":
            return {
                ...state,
                requestState: { status: "idle" },
                resultArr: [action.result, ...state.resultArr],
            }

        case "submitFailed":
            return {
                ...state,
                requestState: { status: "error", message: action.message },
            }

        case "resultRemoved":
            return {
                ...state,
                resultArr: state.resultArr.filter(
                    (_, index) => index !== action.indexToRemove,
                ),
            }

        case "resultReordered": {
            const next = [...state.resultArr]
            const [moved] = next.splice(action.fromIndex, 1)
            next.splice(action.toIndex, 0, moved)

            return {
                ...state,
                resultArr: next,
            }
        }

        default:
            return state
    }
}

export function useSearchShellController(): UseSearchShellControllerReturn {
    const [state, dispatch] = useReducer(searchShellReducer, {
        pokemonList: [],
        versionGroupName: "",
        pokemonName: "",
        resultArr: [],
        requestState: { status: "idle" },
    })

    useEffect(() => {
        if (!state.versionGroupName) {
            dispatch({ type: "pokemonListLoaded", pokemonList: [] })
            return
        }

        let cancelled = false

        const loadPokemon = async () => {
            try {
                const pokemon = await getAllPokemonByVersionGroupName(state.versionGroupName)
                if (!cancelled) {
                    dispatch({ type: "pokemonListLoaded", pokemonList: pokemon })
                }
            } catch {
                if (!cancelled) {
                    dispatch({ type: "pokemonListFailed" })
                }
            }
        }

        loadPokemon()

        return () => {
            cancelled = true
        }
    }, [state.versionGroupName])

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        dispatch({ type: "submitStarted" })

        try {
            const pokemonMoves =
                await getLevelUpMovesByPokemonNameAndGeneration(
                    state.pokemonName,
                    state.versionGroupName,
                )

            dispatch({
                type: "submitSucceeded",
                result: { ...pokemonMoves, id: crypto.randomUUID() },
            })
        } catch {
            dispatch({
                type: "submitFailed",
                message: "An error occurred while searching. Please try again.",
            })
        }
    }

    return {
        pokemonList: state.pokemonList,
        versionGroupName: state.versionGroupName,
        pokemonName: state.pokemonName,
        resultArr: state.resultArr,
        isSubmitting: state.requestState.status === "loading",
        error:
            state.requestState.status === "error"
                ? state.requestState.message
                : null,
        setVersionGroupName: (name: string) =>
            dispatch({ type: "versionGroupChanged", versionGroupName: name }),
        setPokemonName: (name: string) =>
            dispatch({ type: "pokemonNameChanged", pokemonName: name }),
        handleSubmit,
        handleRemoveResult: (indexToRemove: number) =>
            dispatch({ type: "resultRemoved", indexToRemove }),
        handleReorderResult: (fromIndex: number, toIndex: number) =>
            dispatch({ type: "resultReordered", fromIndex, toIndex }),
    }
}