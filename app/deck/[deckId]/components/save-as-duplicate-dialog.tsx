"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { SaveAsDuplicateSchema, SaveAsDuplicateSchemaType } from "@/lib/schemas"
import { DuplicateLearnsetResult } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type SaveAsDuplicateDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onCreateDuplicateLearnsetDeckWithChanges: (learnsetName: string) => Promise<DuplicateLearnsetResult>
}

export default function SaveAsDuplicateDialog({
    open,
    onOpenChange,
    onCreateDuplicateLearnsetDeckWithChanges,
}: SaveAsDuplicateDialogProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<SaveAsDuplicateSchemaType>({
        resolver: zodResolver(SaveAsDuplicateSchema),
        defaultValues: {
            learnsetName: "",
        },
    })

    const handleSave = async ({ learnsetName }: SaveAsDuplicateSchemaType) => {
        setIsSaving(true)

        try {
            const duplicateResult = await onCreateDuplicateLearnsetDeckWithChanges(learnsetName)

            if (!duplicateResult.ok) {
                toast.error(duplicateResult.message, {
                    position: "top-center",
                })
                return
            }

            toast.success("Duplicate learnset saved successfully!", {
                position: "top-center",
            })
            onOpenChange(false)
            form.reset()
            router.push(`/deck/${duplicateResult.deckId}`)
        } catch (error) {
            toast.error("Failed to save duplicate learnset.", {
                description: error instanceof Error ? error.message : "Unknown error",
                position: "top-center",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog
            open={ open }
            onOpenChange={ (open) => {
                onOpenChange(open)
                if (!open) {
                    form.reset()
                }
            } }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save as duplicate</DialogTitle>
                    <DialogDescription>Enter a name for the duplicate learnset.</DialogDescription>
                </DialogHeader>
                <form onSubmit={ form.handleSubmit(handleSave) }>
                    <FieldSet>
                        <FieldGroup className="space-y-4 py-2 pb-4">
                            <Field orientation="vertical">
                                <Label htmlFor="duplicate-learnset-name">Duplicate Learnset Name</Label>
                                <Input
                                    id="duplicate-learnset-name"
                                    type="text"
                                    placeholder="Enter a name for the duplicate learnset"
                                    maxLength={ 50 }
                                    aria-invalid={ form.formState.errors.learnsetName ? true : undefined }
                                    { ...form.register("learnsetName") }
                                    disabled={ isSaving }
                                />
                                { form.formState.errors.learnsetName && (
                                    <FieldError>{ form.formState.errors.learnsetName.message }</FieldError>
                                ) }
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <Button type="submit" disabled={ isSaving }>
                                { isSaving ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Spinner className="size-4" />
                                        Saving...
                                    </span>
                                ) : (
                                    "Save"
                                ) }
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={ isSaving } onClick={ () => onOpenChange(false) }>
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </FieldSet>
                </form>
            </DialogContent>
        </Dialog>
    )
}
