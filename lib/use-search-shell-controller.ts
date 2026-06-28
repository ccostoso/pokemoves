import {
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndVersionGroup,
} from "./actions/qraphql-actions"
import { LevelUpLearnset, PokemonListItem } from "./types"
import { SubmitEventHandler, useEffect, useReducer } from "react"

type RequestState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error", message: string }

type SearchShellState = {
    pokemonList: PokemonListItem[],
    versionGroupName: string,
    pokemonName: string,
    learnsetList: LevelUpLearnset[],
    requestState: RequestState,
    isPokemonListLoading: boolean
}

type SearchShellAction =
    | { type: "versionGroupChanged", versionGroupName: string }
    | { type: "pokemonNameChanged", pokemonName: string }
    | { type: "pokemonListLoading" }
    | { type: "pokemonListLoaded", pokemonList: PokemonListItem[] }
    | { type: "pokemonListFailed" }
    | { type: "submitStarted" }
    | { type: "submitSucceeded", learnset: LevelUpLearnset }
    | { type: "submitFailed", message: string }
    | { type: "learnsetRemoved", indexToRemove: number }
    | { type: "learnsetReordered", fromIndex: number, toIndex: number }

type UseSearchShellControllerReturn = {
    // form state
    pokemonList: PokemonListItem[],
    versionGroupName: string,
    pokemonName: string,

    // learnset list state
    learnsetList: LevelUpLearnset[],

    // request/derived UI state
    isSubmitting: boolean,
    pokemonListLoading: boolean,
    error: string | null,

    // setters used by SearchPanel inputs
    setVersionGroupName: (name: string) => void,
    setPokemonName: (name: string) => void,

    // handlers used by child components
    handleSubmit: SubmitEventHandler<HTMLFormElement>,
    handleRemoveLearnset: (indexToRemove: number) => void,
    handleReorderLearnset: (fromIndex: number, toIndex: number) => void
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
                pokemonName: "",
            }

        case "pokemonNameChanged":
            return {
                ...state,
                pokemonName: action.pokemonName,
            }
        
        case "pokemonListLoading":
            return {
                ...state,
                isPokemonListLoading: true,
            }

        case "pokemonListLoaded":
            return {
                ...state,
                pokemonList: action.pokemonList,
                isPokemonListLoading: false,
            }

        case "pokemonListFailed":
            return {
                ...state,
                pokemonList: [],
                isPokemonListLoading: false,
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
                learnsetList: [...state.learnsetList, action.learnset],
            }

        case "submitFailed":
            return {
                ...state,
                requestState: { status: "error", message: action.message },
            }

        case "learnsetRemoved":
            return {
                ...state,
                learnsetList: state.learnsetList.filter(
                    (_, index) => index !== action.indexToRemove,
                ),
            }

        case "learnsetReordered": {
            const next = [...state.learnsetList]
            const [moved] = next.splice(action.fromIndex, 1)
            next.splice(action.toIndex, 0, moved)

            return {
                ...state,
                learnsetList: next,
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
        learnsetList: [],
        requestState: { status: "idle" },
        isPokemonListLoading: false,
    })

    useEffect(() => {
        if (!state.versionGroupName) {
            dispatch({ type: "pokemonListLoaded", pokemonList: [] })
            return
        }

        let cancelled = false

        const loadPokemon = async () => {
            dispatch({ type: "pokemonListLoading" })

            try {
                const pokemon = await getAllPokemonByVersionGroupName(
                    state.versionGroupName,
                )
                if (!cancelled) {
                    dispatch({
                        type: "pokemonListLoaded",
                        pokemonList: pokemon,
                    })
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

        const isDuplicate = state.learnsetList.some(
            (learnset) =>
                learnset.pokemonName === state.pokemonName &&
            learnset.versionGroupName === state.versionGroupName
        )

        if (isDuplicate) {
            dispatch({
                type: "submitFailed",
                message: `${state.pokemonName} in ${state.versionGroupName} is already in this deck.`,
            })
            return
        }


        dispatch({ type: "submitStarted" })

        try {
            const pokemonMoves =
                await getLevelUpMovesByPokemonNameAndVersionGroup(
                    state.pokemonName,
                    state.versionGroupName,
                )

            console.log("pokemonMoves", pokemonMoves)
            console.log(
                "pokemonMoves.pokemon.length",
                pokemonMoves.pokemon.length,
            )

            const hasMoves = pokemonMoves.pokemon.some(
                (p) => p.pokemonmoves.length > 0,
            )

            if (!hasMoves) {
                dispatch({
                    type: "submitFailed",
                    message: `No level-up moves found for ${state.pokemonName} in ${state.versionGroupName}.`,
                })
                return
            }

            dispatch({
                type: "submitSucceeded",
                learnset: { ...pokemonMoves, id: crypto.randomUUID() },
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
        learnsetList: state.learnsetList,
        isSubmitting: state.requestState.status === "loading",
        pokemonListLoading: state.isPokemonListLoading,
        error:
            state.requestState.status === "error"
                ? state.requestState.message
                : null,
        setVersionGroupName: (name: string) =>
            dispatch({ type: "versionGroupChanged", versionGroupName: name }),
        setPokemonName: (name: string) =>
            dispatch({ type: "pokemonNameChanged", pokemonName: name }),
        handleSubmit,
        handleRemoveLearnset: (indexToRemove: number) =>
            dispatch({ type: "learnsetRemoved", indexToRemove }),
        handleReorderLearnset: (fromIndex: number, toIndex: number) =>
            dispatch({ type: "learnsetReordered", fromIndex, toIndex }),
    }
}
