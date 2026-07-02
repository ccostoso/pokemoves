import {
    getAllPokemonByVersionGroupName,
    getLevelUpMovesByPokemonNameAndVersionGroup,
} from "./actions/qraphql-actions"
import { saveLearnset, updateLearnsetDeck } from "./actions/db-actions"
import { LearnsetDeckItemData, LevelUpLearnset, PokemonListItem } from "./types"
import {
    countLearnsetPairOccurrences,
    createLearnsetInstanceId,
    getNextLearnsetOccurrence,
    mapLearnsetsToDeckItems,
} from "./utils"
import { SubmitEventHandler, useEffect, useMemo, useReducer, useRef } from "react"

type RequestState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error", message: string }

type SearchShellState = {
    pokemonList: PokemonListItem[],
    versionGroupName: string,
    pokemonName: string,
    learnsetList: LevelUpLearnset[],
    savedLearnsetSignature: string,
    requestState: RequestState,
    isPokemonListLoading: boolean
}

type SearchShellAction =
    | { type: "versionGroupChanged", versionGroupName: string }
    | { type: "pokemonNameChanged", pokemonName: string }
    | { type: "pokemonListLoading" }
    | { type: "pokemonListLoaded", pokemonList: PokemonListItem[] }
    | { type: "pokemonListFailed" }
    | { type: "addLearnsetStarted" }
    | { type: "addLearnsetSucceeded", learnset: LevelUpLearnset }
    | { type: "addLearnsetFailed", message: string }
    | { type: "learnsetCleared" }
    | { type: "learnsetRemoved", indexToRemove: number }
    | { type: "learnsetReordered", fromIndex: number, toIndex: number }
    | { type: "learnsetHydrationStarted" }
    | { type: "learnsetHydrationSucceeded", learnsetList: LevelUpLearnset[] }
    | { type: "learnsetHydrationFailed", message: string }
    | { type: "savedBaselineSynced", signature: string }

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
    hasUnsavedChanges: boolean,

    // setters used by SearchPanel inputs
    setVersionGroupName: (name: string) => void,
    setPokemonName: (name: string) => void,

    // handlers used by child components
    handleAddLearnset: SubmitEventHandler<HTMLFormElement>,
    handleSaveChanges: (name: string) => Promise<string>,
    handleSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>,
    handleDuplicateOriginalWithoutSaving: (userId: string, learnsetName: string) => Promise<string>,
    handleRevertChanges: () => void,
    handleClearLearnsets: () => void,
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

        case "addLearnsetStarted":
            return {
                ...state,
                requestState: { status: "loading" },
            }

        case "addLearnsetSucceeded":
            return {
                ...state,
                requestState: { status: "idle" },
                learnsetList: [...state.learnsetList, action.learnset],
            }

        case "addLearnsetFailed":
            return {
                ...state,
                requestState: { status: "error", message: action.message },
            }

        case "learnsetCleared":
            return {
                ...state,
                learnsetList: [],
                requestState: { status: "idle" },
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

        case "learnsetHydrationStarted":
            return {
                ...state,
                requestState: { status: "loading" },
            }

        case "learnsetHydrationSucceeded":
            return {
                ...state,
                learnsetList: action.learnsetList,
                requestState: { status: "idle" },
            }

        case "learnsetHydrationFailed":
            return {
                ...state,
                requestState: { status: "error", message: action.message },
            }

        case "savedBaselineSynced":
            return {
                ...state,
                savedLearnsetSignature: action.signature,
            }

        default:
            return state
    }
}

export function useSearchShellController(
    initialLearnsetDeckItemData?: LearnsetDeckItemData[] | null,
    initialLearnsetDeckId?: string,
    initialHydratedLearnsetList?: LevelUpLearnset[] | null,
): UseSearchShellControllerReturn {
    const hydratedDeckKeyRef = useRef<string | null>(null)

    const originalLearnsetDeckSnapshot = useMemo<LearnsetDeckItemData[]>(() => {
        if (initialLearnsetDeckItemData && initialLearnsetDeckItemData.length > 0) {
            return initialLearnsetDeckItemData
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((item, index) => ({
                    pokemonName: item.pokemonName,
                    versionGroupName: item.versionGroupName,
                    sortOrder: index,
                }))
        }

        if (initialHydratedLearnsetList && initialHydratedLearnsetList.length > 0) {
            return initialHydratedLearnsetList.map((item, index) => ({
                pokemonName: item.pokemonName,
                versionGroupName: item.versionGroupName,
                sortOrder: index,
            }))
        }

        return []
    }, [initialLearnsetDeckItemData, initialHydratedLearnsetList])

    const initialLearnsetSignature =
        originalLearnsetDeckSnapshot
            .map((item) => `${item.pokemonName}:${item.versionGroupName}`)
            .join("|")

    const [state, dispatch] = useReducer(searchShellReducer, {
        pokemonList: [],
        versionGroupName: "",
        pokemonName: "",
        learnsetList: initialHydratedLearnsetList ?? [],
        savedLearnsetSignature: initialLearnsetSignature,
        requestState: { status: "idle" },
        isPokemonListLoading: false,
    })

    const revertBaselineLearnsetListRef = useRef<LevelUpLearnset[]>(
        initialHydratedLearnsetList ?? [],
    )

    const toLearnsetSignature = (learnsetList: LevelUpLearnset[]): string =>
        learnsetList
            .map((item) => `${item.pokemonName}:${item.versionGroupName}`)
            .join("|")

    const hasUnsavedChanges =
        toLearnsetSignature(state.learnsetList) !== state.savedLearnsetSignature

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

    const handleAddLearnset: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        const isDuplicate = state.learnsetList.some(
            (learnset) =>
                learnset.pokemonName === state.pokemonName &&
            learnset.versionGroupName === state.versionGroupName
        )

        if (isDuplicate) {
            dispatch({
                type: "addLearnsetFailed",
                message: `${state.pokemonName} in ${state.versionGroupName} is already in this deck.`,
            })
            return
        }

        dispatch({ type: "addLearnsetStarted" })

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
                    type: "addLearnsetFailed",
                    message: `No level-up moves found for ${state.pokemonName} in ${state.versionGroupName}.`,
                })
                return
            }

            dispatch({
                type: "addLearnsetSucceeded",
                learnset: {
                    ...pokemonMoves,
                    id: createLearnsetInstanceId(
                        pokemonMoves.pokemonName,
                        pokemonMoves.versionGroupName,
                        countLearnsetPairOccurrences(
                            state.learnsetList,
                            pokemonMoves.pokemonName,
                            pokemonMoves.versionGroupName,
                        ) + 1,
                    ),
                },
            })
        } catch {
            dispatch({
                type: "addLearnsetFailed",
                message: "An error occurred while searching. Please try again.",
            })
        }
    }

    const handleSaveChanges = async (name: string): Promise<string> => {
        const trimmedLearnsetName = name.trim()
        const deckId = initialLearnsetDeckId

        if (!deckId) {
            throw new Error("Invalid deck ID.")
        }

        if (!trimmedLearnsetName) {
            throw new Error("Please enter a name for the learnset deck.")
        }

        const formattedLearnset = mapLearnsetsToDeckItems(state.learnsetList)

        if (formattedLearnset.length === 0) {
            throw new Error("No learnset to save.")
        }

        const updatedDeckId = await updateLearnsetDeck(deckId, trimmedLearnsetName, formattedLearnset)
        revertBaselineLearnsetListRef.current = [...state.learnsetList]
        dispatch({
            type: "savedBaselineSynced",
            signature: toLearnsetSignature(state.learnsetList),
        })

        return updatedDeckId
    }

    const duplicateFromSource = async (
        userId: string,
        learnsetName: string,
        sourceDeck: LearnsetDeckItemData[],
    ): Promise<string> => {
        const trimmedLearnsetName = learnsetName.trim()

        if (!userId) throw new Error("You must be logged in to duplicate this learnset.")
        if (!trimmedLearnsetName) throw new Error("Please enter a name for the duplicate learnset.")
        if (sourceDeck.length === 0) throw new Error("No learnset to duplicate.")

        return saveLearnset(userId, trimmedLearnsetName, sourceDeck)
    }

    const handleSaveAsDuplicate = async (userId: string, learnsetName: string): Promise<string> => {
        return duplicateFromSource(userId, learnsetName, mapLearnsetsToDeckItems(state.learnsetList))
    }

    const handleDuplicateOriginalWithoutSaving = async (userId: string, learnsetName: string): Promise<string> => {
        return duplicateFromSource(userId, learnsetName, originalLearnsetDeckSnapshot)
    }

    useEffect(() => {
        if (initialHydratedLearnsetList) {
            revertBaselineLearnsetListRef.current = initialHydratedLearnsetList
        }
    }, [initialHydratedLearnsetList])

    useEffect(() => {
        if (initialHydratedLearnsetList) {
            return
        }

        // If there is no initial learnset deck data, or if the length is zero, we don't need to hydrate anything
        if (!initialLearnsetDeckItemData || initialLearnsetDeckItemData.length === 0) {
            dispatch({ type: "learnsetHydrationSucceeded", learnsetList: [] })
            return
        }

        // Create a unique key for the initial learnset deck data to avoid rehydrating if it hasn't changed
        const learnsetContentKey = initialLearnsetDeckItemData
            .map((item) => `${item.pokemonName}:${item.versionGroupName}:${item.sortOrder}`)
            .join("|")

        const deckKey = `${initialLearnsetDeckId ?? "unknown"}|${learnsetContentKey}`

        if (hydratedDeckKeyRef.current === deckKey) {
            return
        }

        hydratedDeckKeyRef.current = deckKey

        // We use a cancelled flag to prevent state updates if the component unmounts before the async 
        // operation completes
        let cancelled = false

        // Hydrate the learnsets from the initialLearnsetDeckItemData
        const hydrateLearnsets = async () => {
            dispatch({ type: "learnsetHydrationStarted" })

            try {
                const occurrenceMap = new Map<string, number>()

                const hydratedLearnsets: LevelUpLearnset[] = await Promise.all(
                    initialLearnsetDeckItemData.map(async (item) => {
                        const pokemonMoves =
                            await getLevelUpMovesByPokemonNameAndVersionGroup(
                                item.pokemonName,
                                item.versionGroupName,
                            )

                        const nextOccurrence = getNextLearnsetOccurrence(
                            occurrenceMap,
                            item.pokemonName,
                            item.versionGroupName,
                        )

                        return {
                            ...pokemonMoves,
                            id: createLearnsetInstanceId(
                                item.pokemonName,
                                item.versionGroupName,
                                nextOccurrence,
                            ),
                        }
                    }),
                )

                if (!cancelled) {
                    revertBaselineLearnsetListRef.current = hydratedLearnsets
                    dispatch({
                        type: "savedBaselineSynced",
                        signature: toLearnsetSignature(hydratedLearnsets),
                    })
                    dispatch({
                        type: "learnsetHydrationSucceeded",
                        learnsetList: hydratedLearnsets,
                    })
                }
            } catch {
                if (!cancelled) {
                    dispatch({
                        type: "learnsetHydrationFailed",
                        message:
                            "An error occurred while hydrating the learnsets. Please try again.",
                    })
                }
            }
        }

        hydrateLearnsets()

        return () => {
            cancelled = true
        }
    }, [initialLearnsetDeckId, initialLearnsetDeckItemData, initialHydratedLearnsetList])

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
        hasUnsavedChanges,
        setVersionGroupName: (name: string) =>
            dispatch({ type: "versionGroupChanged", versionGroupName: name }),
        setPokemonName: (name: string) =>
            dispatch({ type: "pokemonNameChanged", pokemonName: name }),
        handleAddLearnset,
        handleSaveChanges,
        handleSaveAsDuplicate,
        handleDuplicateOriginalWithoutSaving,
        handleRevertChanges: () => {
            dispatch({ type: "learnsetHydrationSucceeded", learnsetList: revertBaselineLearnsetListRef.current ?? [] })
        },
        handleClearLearnsets: () => dispatch({ type: "learnsetCleared" }),
        handleRemoveLearnset: (indexToRemove: number) =>
            dispatch({ type: "learnsetRemoved", indexToRemove }),
        handleReorderLearnset: (fromIndex: number, toIndex: number) =>
            dispatch({ type: "learnsetReordered", fromIndex, toIndex }),
    }
}
