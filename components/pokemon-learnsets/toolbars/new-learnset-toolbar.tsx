import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToolbarActions } from "./toolbar-actions"
import { Spinner } from "@/components/ui/spinner"
import { createLearnsetDeck } from "@/lib/actions/db-actions"
import { authClient } from "@/lib/auth/auth-client"
import { LearnsetDeckTitleSchema } from "@/lib/schemas"
import { LevelUpLearnset, PokemonListItem } from "@/lib/types"
import { BrushCleaning, Save } from "lucide-react"
import { SubmitEventHandler, useState } from "react"
import { toast } from "sonner"
import { mapLearnsetsToDeckItems } from "@/lib/utils"

type NewLearnsetToolbarProps = {
    learnsets: LevelUpLearnset[],
    onClearLearnsetsFromDeck: () => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
}

export function NewLearnsetToolbar({
    learnsets,
    onClearLearnsetsFromDeck,
    isSubmitting,
}: NewLearnsetToolbarProps) {
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

        if (!session?.user.emailVerified) {
            toast.error("You must verify your email before saving a learnset deck. Please check your inbox for the verification email.", { position: "top-center" })
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

        if (learnsets.length === 0) {
            toast.error("No learnsets to save. Please add a Pokémon first.", { position: "top-center" })
            setIsSaving(false)
            return
        }

        try {
            const formattedLearnset = mapLearnsetsToDeckItems(learnsets)
            await createLearnsetDeck(learnsetTitleResult.data, formattedLearnset)

            setLearnsetDeckName("")
            setLearnsetDeckNameError(null)
            toast.success("Learnset deck saved successfully!", {
                description: "You can view your saved learnset decks in your profile.",
                position: "top-center",
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to save learnset deck. Please try again.", {
                description: error instanceof Error ? error.message : "Unknown error",
                position: "top-center",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleClearLearnsetsFromDeck = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        onClearLearnsetsFromDeck()
        toast.success("Learnset panel cleared.", { position: "top-center" })
    }

    return (
        <div className="flex flex-col p-4 border-b">
            <form onSubmit={ handleCreateLearnsetDeck }>
                <FieldSet className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                    <FieldGroup>
                        <Field className="flex-1">
                            <Input
                                id="learnset-deck-name"
                                className="max-md:h-11"
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
                        </Field>
                    </FieldGroup>
                    <ToolbarActions>
                        <FieldGroup className="flex flex-row flex-wrap justify-start gap-2 lg:justify-end">
                            <Field orientation="horizontal" className="w-auto max-md:w-full max-md:flex-col">
                                <Button
                                    className="max-md:h-11 max-md:w-full"
                                    type="submit"
                                    disabled={ isSaving || isSubmitting }
                                >
                                    { isSaving ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Spinner className="size-4" />
                                            Saving...
                                        </span>
                                    ) : (
                                        <>
                                            <Save className="mr-2" />
                                            Save learnset deck
                                        </>
                                    ) }
                                </Button>
                                <Button
                                    className="max-md:h-11 max-md:w-full"
                                    type="button"
                                    onClick={ (event) => {
                                        handleClearLearnsetsFromDeck(event)
                                    } }
                                    disabled={ isSaving || isSubmitting || learnsets.length === 0 }
                                >
                                    <BrushCleaning className="mr-2" />
                                    Clear all learnsets
                                </Button>
                            </Field>
                        </FieldGroup>
                    </ToolbarActions>
                </FieldSet>
            </form>
        </div>
    )
}
