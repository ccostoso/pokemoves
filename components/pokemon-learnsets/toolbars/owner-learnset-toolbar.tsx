import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BrushCleaning, ChevronDownIcon, CopyCheck, CopyX, Save, Trash, Undo } from "lucide-react"
import { SubmitEventHandler, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import SaveAsDuplicateDialog from "@/app/deck/[deckId]/components/save-as-duplicate-dialog"
import ConfirmDeleteLearnsetDeckDialog from "@/app/deck/[deckId]/components/confirm-delete-learnset-deck-dialog"
import { toast } from "sonner"

type OwnerLearnsetToolbarProps = {
    learnsetDeckName?: string | null,
    onSaveChanges: (name: string) => Promise<string>,
    onSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>,
    onDuplicateOriginalWithoutSaving: (userId: string, learnsetName: string) => Promise<string>,
    onRevertChanges: () => void,
    onClearLearnsets: () => void,
    onDeleteLearnsetDeck: () => Promise<void>,
    hasUnsavedChanges: boolean,
    learnsetsLength: number
}

export function OwnerLearnsetToolbar({ learnsetDeckName, onSaveChanges, onSaveAsDuplicate, onDuplicateOriginalWithoutSaving, onRevertChanges, onClearLearnsets, onDeleteLearnsetDeck, hasUnsavedChanges, learnsetsLength }: OwnerLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [ inputValue, setInputValue ] = useState(learnsetDeckName ?? "")
    const [ savedDeckName, setSavedDeckName ] = useState(learnsetDeckName ?? "")
    
    type DuplicateMode = "current" | "original"
    const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("current")
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)

    const hasNameChanges = inputValue.trim() !== savedDeckName.trim()
    const hasAnyUnsavedChanges = hasUnsavedChanges || hasNameChanges

    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleSaveChanges: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        try {
            await onSaveChanges(inputValue)
            setSavedDeckName(inputValue)
            toast.success("Deck changes saved", { position: "top-center" })
        } catch (error) {
            toast.error("Failed to save deck changes", {
                description: error instanceof Error ? error.message : "Unknown error",
                position: "top-center",
            })
        }
    }

    const handleSaveAsDuplicate = async (learnsetName: string): Promise<string> => {
        const userId = session?.user?.id

        if (!userId) {
            toast.error("You must be logged in to duplicate this learnset.", { position: "top-center" })
            throw new Error("You must be logged in to duplicate this learnset.")
        }

        switch (duplicateMode) {
            case "current":
                return onSaveAsDuplicate(userId, learnsetName)
            case "original":
                return onDuplicateOriginalWithoutSaving(userId, learnsetName)
        }
    }

    const handleRevertChanges = () => {
        setInputValue(savedDeckName)
        onRevertChanges()
        toast.success("All unsaved changes reverted", { position: "top-center" })
    }

    const handleDuplicateMenuItemSelect = (mode: DuplicateMode) => {
        setDuplicateMode(mode)
        setIsDuplicateDialogOpen(true)
    }

    const handleClearLearnsets = () => {
        onClearLearnsets()
        toast.success("Learnset panel cleared", { 
            description: "Click on \"Save changes\" to apply this change to the learnset deck",
            position: "top-center" })
    }

    const handleConfirmDeleteLearnsetDeck = async () => {
        const userId = session?.user?.id

        if (!userId) {
            toast.error("You must be logged in to delete this learnset deck.", { position: "top-center" })
            return
        }

        setIsDeleting(true)

        try {
            await onDeleteLearnsetDeck()
            setIsDeleteDialogOpen(false)
            toast.success("Learnset deck deleted successfully!", { position: "top-center" })
            router.push("/account/decks")
        } catch (error) {
            toast.error("Failed to delete learnset deck.", {
                description: error instanceof Error ? error.message : "Unknown error",
                position: "top-center",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex flex-col p-4 border-b">
            <form id="owner-learnset-toolbar-form" onSubmit={ handleSaveChanges }>
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
                                    disabled={ !hasAnyUnsavedChanges || learnsetsLength === 0 }
                                    name="intent"
                                    value="save-changes"
                                >
                                    <Save className="mr-2" /> Save changes
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button disabled={ learnsetsLength === 0 }><ChevronDownIcon /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-auto min-w-44">
                                        <DropdownMenuItem
                                            className="whitespace-nowrap"
                                            disabled={ !hasUnsavedChanges || learnsetsLength === 0 }
                                            onSelect={ () => handleDuplicateMenuItemSelect("current") }
                                        >
                                            <CopyCheck className="mr-2" />Save as duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="whitespace-nowrap"
                                            disabled={ learnsetsLength === 0 }
                                            onSelect={ () => handleDuplicateMenuItemSelect("original") }
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
                                    <Button type="button" disabled={ !hasAnyUnsavedChanges } onClick={ handleRevertChanges }>
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
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            onClick={ () => setIsDeleteDialogOpen(true) }
                                        ><Trash className="mr-2" />Delete</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete this learnset deck</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="destructive"><ChevronDownIcon /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-auto min-w-44">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuItem 
                                                    className="whitespace-nowrap" 
                                                    onSelect={ handleClearLearnsets }
                                                    disabled={ learnsetsLength === 0 }
                                                ><BrushCleaning className="mr-2" />Clear</DropdownMenuItem>
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
            <ConfirmDeleteLearnsetDeckDialog
                open={ isDeleteDialogOpen }
                isDeleting={ isDeleting }
                onOpenChange={ setIsDeleteDialogOpen }
                onConfirmDeleteLearnsetDeck={ handleConfirmDeleteLearnsetDeck }
            />
        </div>
    )
}