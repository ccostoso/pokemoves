import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Field, FieldGroup, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDownIcon, CopyX, Save, Trash, Undo, CopyCheck, BrushCleaning } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { LearnsetDeckItemData, LevelUpLearnset, PokemonListItem } from "@/lib/types"
import { SubmitEventHandler, useState } from "react"
import { saveLearnset } from "@/lib/actions/db-actions"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"

export function OwnerPokemonLearnsetToolbar() {
    return (
        <div className="flex flex-col p-4 border-b">
            <form>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1 max-w-1/2">
                            <Input id="learnset-name" type="text" placeholder="Learnset Name..." />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row justify-end gap-2">
                        <Field orientation="horizontal" className="w-auto">
                            <ButtonGroup className="flex justify-end">
                                <Button type="submit" variant="default">
                                    <Save className="mr-2" /> Save changes
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button><ChevronDownIcon /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-auto min-w-44">
                                        <DropdownMenuItem className="whitespace-nowrap"><CopyCheck className="mr-2" />Save as duplicate</DropdownMenuItem>
                                        <DropdownMenuItem className="whitespace-nowrap"><CopyX className="mr-2" />Duplicate without unsaved changes</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                        </Field>
                        <Field orientation="horizontal" className="w-auto">
                            <ButtonGroup className="flex">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button"><Undo className="mr-2" />Revert</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Discard all unsaved changes</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button><ChevronDownIcon /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-auto min-w-44">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuItem className="whitespace-nowrap"><BrushCleaning className="mr-2" />Clear</DropdownMenuItem>
                                            </TooltipTrigger>
                                            <TooltipContent side="left">
                                                <p>Remove all learnsets from this deck</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                        </Field>
                        <Field orientation="horizontal" className="w-auto">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" variant="destructive"><Trash className="mr-2" />Delete</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete this learnset</p>
                                </TooltipContent>
                            </Tooltip>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    )
}

export function ViewerPokemonLearnsetToolbar() {
    const { data: session } = authClient.useSession()
    return (
        <div className="flex flex-col p-4 border-b">
            <form>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className={cn("flex-1", session?.user ? "max-w-full" : "max-w-1/2")}>
                            <Input id="learnset-name" type="text" placeholder="Learnset Name..." disabled />
                        </Field>
                    </FieldGroup>
                    {session?.user && (
                        <FieldGroup className="flex flex-row justify-end gap-2">
                            <Field orientation="horizontal" className="w-auto">
                                <Button type="submit"><CopyCheck className="mr-2" />Save as duplicate</Button>
                            </Field>
                        </FieldGroup>
                    )}
                </FieldSet>
            </form>
        </div>
    )
}

type NewPokemonLearnsetToolbarProps = {
    learnsetList: LevelUpLearnset[],
    handleClearLearnsets: () => void,
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
}

export function NewPokemonLearnsetToolbar({ learnsetList, handleClearLearnsets, pokemonList, isSubmitting }: NewPokemonLearnsetToolbarProps) {
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
            toast.error("You must be logged in to save a learnset.", {position: "top-center"})
            setIsSaving(false)
            return
        }
        if (!learnsetName) {
            toast.error("Please enter a name for your learnset.", {position: "top-center"})
            setIsSaving(false)
            return
        }
        if (learnsetList.length === 0) {
            toast.error("No learnset to save. Please add a Pokémon first.", {position: "top-center"})
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
            <form onSubmit={handleSaveLearnset}>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1">
                            <Input 
                                id="learnset-name" 
                                type="text" 
                                placeholder="Learnset Name..." 
                                value={learnsetName} 
                                onChange={(e) => setLearnsetName(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row justify-end gap-2">
                        <Field orientation="horizontal" className="w-auto">
                            <Button
                                type="submit"
                                disabled={isSaving || isSubmitting || !learnsetName || pokemonList.length === 0}
                            >
                                {isSaving ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Spinner className="size-4" />
                                        Saving...
                                    </span>
                                ) : (<>
                                    <Save className="mr-2" />Save learnset</>)}
                            </Button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        className="whitespace-nowrap" 
                                        type="button"
                                        onClick={() => {
                                            handleClearLearnsets()
                                            toast.success("Learnset panel cleared.", {position: "top-center"})
                                        }}
                                        disabled={isSaving || isSubmitting || learnsetList.length === 0}
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