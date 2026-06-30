import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { saveLearnset } from "@/lib/actions/db-actions"
import { authClient } from "@/lib/auth-client"
import { LearnsetDeckItemData, LevelUpLearnset, PokemonListItem } from "@/lib/types"
import { BrushCleaning, Save } from "lucide-react"
import { SubmitEventHandler, useState } from "react"
import { toast } from "sonner"

type NewLearnsetToolbarProps = {
    learnsetList: LevelUpLearnset[],
    handleClearLearnsets: () => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
}

export function NewLearnsetToolbar({ learnsetList, handleClearLearnsets, pokemonList, isSubmitting }: NewLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [learnsetName, setLearnsetName] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const mapLevelUpLearsetToDbFormat = (learnset: LevelUpLearnset[]): LearnsetDeckItemData[] => {
        return learnset.map((item, index) => ({
            pokemonName: item.pokemonName,
            versionGroupName: item.versionGroupName,
            sortOrder: index,
        }))
    }

    const handleSaveLearnset: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        console.log("Learnset list length:", learnsetList.length)
        setIsSaving(true)

        if (!session?.user) {
            toast.error("You must be logged in to save a learnset.", { position: "top-center" })
            setIsSaving(false)
            return
        }
        if (!learnsetName) {
            toast.error("Please enter a name for your learnset.", { position: "top-center" })
            setIsSaving(false)
            return
        }
        if (learnsetList.length === 0) {
            toast.error("No learnset to save. Please add a Pokémon first.", { position: "top-center" })
            setIsSaving(false)
            return
        }

        try {
            const formattedLearnset = mapLevelUpLearsetToDbFormat(learnsetList)
            await saveLearnset(session.user.id, learnsetName, formattedLearnset)

            setLearnsetName("")
            toast.success("Learnset saved successfully!", {
                description: "You can view your saved learnsets in your profile.",
                position: "top-center"
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to save learnset. Please try again.", {
                description: error instanceof Error ? error.message : "Unknown error",
                position: "top-center"
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col p-4 border-b">
            <form onSubmit={ handleSaveLearnset }>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1">
                            <Input 
                                id="learnset-name" 
                                type="text" 
                                placeholder="Learnset Name..." 
                                value={ learnsetName } 
                                onChange={ (e) => setLearnsetName(e.target.value) }
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row justify-end gap-2">
                        <Field orientation="horizontal" className="w-auto">
                            <Button
                                type="submit"
                                disabled={ isSaving || isSubmitting || !learnsetName || pokemonList.length === 0 }
                            >
                                { isSaving ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Spinner className="size-4" />
                                        Saving...
                                    </span>
                                ) : (<>
                                    <Save className="mr-2" />Save learnset</>) }
                            </Button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        className="whitespace-nowrap" 
                                        type="button"
                                        onClick={ () => {
                                            handleClearLearnsets()
                                            toast.success("Learnset panel cleared.", { position: "top-center" })
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