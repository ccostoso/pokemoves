import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BrushCleaning, ChevronDownIcon, CopyCheck, CopyX, Save, Trash, Undo } from "lucide-react"
import { useState } from "react"

type OwnerLearnsetToolbarProps = {
    learnsetDeckName?: string | null
}

export function OwnerLearnsetToolbar({ learnsetDeckName }: OwnerLearnsetToolbarProps) {
    const [ inputValue, setInputValue ] = useState(learnsetDeckName ?? "")

    return (
        <div className="flex flex-col p-4 border-b">
            <form>
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button"><Undo className="mr-2" />Revert</Button>
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
        </div>
    )
}