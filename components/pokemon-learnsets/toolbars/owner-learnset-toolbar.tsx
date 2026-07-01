import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BrushCleaning, ChevronDownIcon, CopyCheck, CopyX, Save, Trash, Undo } from "lucide-react"
import { SubmitEventHandler, useState } from "react"
import { authClient } from "@/lib/auth-client"
import SaveAsDuplicateDialog from "@/app/deck/[deckId]/components/save-as-duplicate-dialog"

type OwnerLearnsetToolbarProps = {
    learnsetDeckName?: string | null,
    onSaveChanges: (name: string) => Promise<string>,
    onSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>,
    onDuplicateOriginalWithoutSaving: (userId: string, learnsetName: string) => Promise<string>,
    hasUnsavedChanges: boolean
}

export function OwnerLearnsetToolbar({ learnsetDeckName, onSaveChanges, onSaveAsDuplicate, onDuplicateOriginalWithoutSaving, hasUnsavedChanges }: OwnerLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [ inputValue, setInputValue ] = useState(learnsetDeckName ?? "")
    
    type DuplicateMode = "current" | "original"
    const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("current")
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)

    const hasNameChanges = inputValue.trim() !== (learnsetDeckName ?? "").trim()
    const hasAnyUnsavedChanges = hasUnsavedChanges || hasNameChanges

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        await onSaveChanges(inputValue)
    }

    const handleSaveAsDuplicate = async (learnsetName: string): Promise<string> => {
        const userId = session?.user?.id

        if (!userId) {
            throw new Error("You must be logged in to duplicate this learnset.")
        }

        switch (duplicateMode) {
            case "current":
                return onSaveAsDuplicate(userId, learnsetName)
            case "original":
                return onDuplicateOriginalWithoutSaving(userId, learnsetName)
        }
    }

    return (
        <div className="flex flex-col p-4 border-b">
            <form id="owner-learnset-toolbar-form" onSubmit={ handleSubmit }>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1">
                            <Input 
                                id="learnset-name" 
                                type="text" placeholder="Learnset Name..." 
                                value={ inputValue } 
                                onChange={ (e) => setInputValue(e.target.value) }
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row justify-end gap-2">
                        <Field orientation="horizontal" className="w-auto">
                            <ButtonGroup className="flex justify-end">
                                <Button 
                                    type="submit" 
                                    variant="default" 
                                    disabled={ !hasAnyUnsavedChanges }
                                    name="intent"
                                    value="save-changes"
                                >
                                    <Save className="mr-2" /> Save changes
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button><ChevronDownIcon /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-auto min-w-44">
                                        <DropdownMenuItem
                                            className="whitespace-nowrap"
                                            disabled={ !hasUnsavedChanges }
                                            onSelect={ (event) => {
                                                event.preventDefault()
                                                setDuplicateMode("current")
                                                setIsDuplicateDialogOpen(true)
                                            } }
                                        >
                                            <CopyCheck className="mr-2" />Save as duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="whitespace-nowrap"
                                            onSelect={ (event) => {
                                                event.preventDefault()
                                                setDuplicateMode("original")
                                                setIsDuplicateDialogOpen(true)
                                            } }
                                        >
                                            <CopyX className="mr-2" />Duplicate without unsaved changes
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                        </Field>
                        <Field orientation="horizontal" className="w-auto">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" disabled={ !hasAnyUnsavedChanges }>
                                        <Undo className="mr-2" />Revert
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Discard all unsaved changes</p>
                                </TooltipContent>
                            </Tooltip>
                        </Field>
                        <Field orientation="horizontal" className="w-auto">
                            <ButtonGroup className="flex">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" variant="destructive"><Trash className="mr-2" />Delete</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete this learnset</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="destructive"><ChevronDownIcon /></Button>
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
                    </FieldGroup>
                </FieldSet>
            </form>
            <SaveAsDuplicateDialog
                open={ isDuplicateDialogOpen }
                onOpenChange={ setIsDuplicateDialogOpen }
                onSaveAsDuplicate={ handleSaveAsDuplicate }
            />
        </div>
    )
}