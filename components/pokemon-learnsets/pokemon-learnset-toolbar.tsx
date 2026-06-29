import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Field, FieldGroup, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDownIcon, CopyX, Save, Trash, Undo, CopyCheck, BrushCleaning } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

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
    return (
        <div className="flex flex-col p-4 border-b">
            <form>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1 max-w-1/2">
                            <Input id="learnset-name" type="text" placeholder="Learnset Name..." disabled />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row justify-end gap-2">
                        <Field orientation="horizontal" className="w-auto">
                            <Button type="submit"><CopyCheck className="mr-2" />Save as duplicate</Button>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    )
}

export function NewPokemonLearnsetToolbar() {
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
                            <ButtonGroup>
                                <Button type="submit"><Save className="mr-2" />Save</Button>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="whitespace-nowrap"><BrushCleaning className="mr-2" />Clear</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Remove all learnsets from this deck</p>
                                    </TooltipContent>
                                </Tooltip>
                            </ButtonGroup>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    )
}