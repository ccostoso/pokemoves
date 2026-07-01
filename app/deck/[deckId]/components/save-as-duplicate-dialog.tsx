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
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { CopyCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type SaveAsDuplicateDialogProps = {
    onSaveAsDuplicate: (learnsetName: string) => Promise<string>
}

export default function SaveAsDuplicateDialog({ onSaveAsDuplicate }: SaveAsDuplicateDialogProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [learnsetName, setLearnsetName] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        const trimmedLearnsetName = learnsetName.trim()

        if (!trimmedLearnsetName) {
            toast.error("Please enter a name for the duplicate learnset.", {
                position: "top-center",
            })
            return
        }

        try {
            setIsSaving(true)
            const duplicatedDeckId = await onSaveAsDuplicate(trimmedLearnsetName)

            toast.success("Duplicate learnset saved successfully!", {
                position: "top-center",
            })
            setIsOpen(false)
            setLearnsetName("")
            router.push(`/deck/${duplicatedDeckId}`)
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
        <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
            <DialogTrigger asChild>
                <Button><CopyCheck className="mr-2" />Save as duplicate</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save as duplicate</DialogTitle>
                    <DialogDescription>
                        Enter a name for the duplicate learnset.
                    </DialogDescription>
                </DialogHeader>
                <FieldSet>
                    <FieldGroup className="space-y-4 py-2 pb-4">
                        <Field orientation="vertical">
                            <Label htmlFor="duplicate-learnset-name">
                                Duplicate Learnset Name
                            </Label>
                            <Input
                                id="duplicate-learnset-name"
                                type="text"
                                placeholder="Enter a name for the duplicate learnset"
                                value={ learnsetName }
                                onChange={ (e) => setLearnsetName(e.target.value) }
                                disabled={ isSaving }
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <Button type="button" onClick={ handleSave } disabled={ isSaving }>
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
                            <Button variant="outline" disabled={ isSaving }>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </FieldSet>
            </DialogContent>
        </Dialog>
    )
}