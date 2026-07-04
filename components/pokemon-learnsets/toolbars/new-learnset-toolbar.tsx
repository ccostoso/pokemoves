import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { createLearnsetDeck } from "@/lib/actions/db-actions"
import { authClient } from "@/lib/auth-client"
import { LearnsetDeckTitleSchema } from "@/lib/schemas"
import { LearnsetDeckItem, LevelUpLearnset, PokemonListItem } from "@/lib/types"
import { BrushCleaning, Save } from "lucide-react"
import { SubmitEventHandler, useState } from "react"
import { toast } from "sonner"
import { mapLearnsetsToDeckItems } from "@/lib/utils"

type NewLearnsetToolbarProps = {
    learnsetList: LevelUpLearnset[],
    onClearLearnsets: () => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
}

export function NewLearnsetToolbar({ learnsetList, onClearLearnsets, pokemonList, isSubmitting }: NewLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [learnsetDeckName, setLearnsetDeckName] = useState("")
    const [learnsetDeckNameError, setLearnsetDeckNameError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleCreateLearnsetDeck: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setLearnsetDeckNameError(null)

        if (!session?.user) {
            toast.error("You must be logged in to save a learnset deck.", { position: "top-center" })
            setIsSaving(false)
            return
        }

        const learnsetTitleResult = LearnsetDeckTitleSchema.safeParse(learnsetDeckName)
        if (!learnsetTitleResult.success) {
            const titleError = learnsetTitleResult.error.issues[0]?.message ?? "Invalid learnset deck name"
            setLearnsetDeckNameError(titleError)
            toast.error(titleError, { position: "top-center" })
            setIsSaving(false)
            return
        }

        if (learnsetList.length === 0) {
            toast.error("No learnset deck to save. Please add a Pokémon first.", { position: "top-center" })
            setIsSaving(false)
            return
        }

        try {
            const formattedLearnset = mapLearnsetsToDeckItems(learnsetList)
            await createLearnsetDeck(learnsetTitleResult.data, formattedLearnset)

            setLearnsetDeckName("")
            setLearnsetDeckNameError(null)
            toast.success("Learnset deck saved successfully!", {
                description: "You can view your saved learnset decks in your profile.",
                position: "top-center"
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to save learnset deck. Please try again.", {
                description: error instanceof Error ? error.message : "Unknown error",
                position: "top-center"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleClearLearnsets = (event: React.MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault()
        onClearLearnsets()
        toast.success("Learnset panel cleared.", { position: "top-center" })
    }

    return (
        <div className="flex flex-col p-4 border-b">
            <form onSubmit={ handleCreateLearnsetDeck }>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1">
                            <Input 
                                id="learnset-deck-name" 
                                type="text" 
                                placeholder="Learnset Deck Name..." 
                                value={ learnsetDeckName } 
                                maxLength={ 50 }
                                aria-invalid={ learnsetDeckNameError ? true : undefined }
                                onChange={ (e) => {
                                    setLearnsetDeckName(e.target.value)
                                    if (learnsetDeckNameError) {
                                        setLearnsetDeckNameError(null)
                                    }
                                } }
                            />
                            { learnsetDeckNameError && (
                                <p className="text-sm text-destructive mt-1">{ learnsetDeckNameError }</p>
                            ) }
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row justify-end gap-2">
                        <Field orientation="horizontal" className="w-auto">
                            <Button
                                type="submit"
                                disabled={ isSaving || isSubmitting || !learnsetDeckName.trim() || pokemonList.length === 0 }
                            >
                                { isSaving ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Spinner className="size-4" />
                                        Saving...
                                    </span>
                                ) : (<>
                                    <Save className="mr-2" />Save learnset deck</>) }
                            </Button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        className="whitespace-nowrap" 
                                        type="button"
                                        onClick={ (event) => {
                                            handleClearLearnsets(event)
                                        } }
                                        disabled={ isSaving || isSubmitting || learnsetList.length === 0 }
                                    ><BrushCleaning className="mr-2" />Clear</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Remove all learnsets from this deck</p>
                                </TooltipContent>
                            </Tooltip>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    )
}