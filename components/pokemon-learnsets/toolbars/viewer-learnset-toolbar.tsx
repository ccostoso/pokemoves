import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import SaveAsDuplicateDialog from "@/app/deck/[deckId]/components/save-as-duplicate-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyCheck } from "lucide-react"
import { DuplicateLearnsetResult } from "@/lib/types"

type ViewerLearnsetToolbarProps = {
    learnsetDeckName?: string | null,
    onCreateDuplicateLearnsetDeckWithChanges: (userId: string, learnsetName: string) => Promise<string>
}

export function ViewerLearnsetToolbar({
    learnsetDeckName,
    onCreateDuplicateLearnsetDeckWithChanges,
}: ViewerLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [isOpen, setIsOpen] = useState(false)

    const handleCreateDuplicateLearnsetDeckWithChanges = async (learnsetName: string): Promise<DuplicateLearnsetResult> => {
        const userId = session?.user?.id

        if (!userId) {
            return { ok: false, message: "You must be logged in to duplicate this learnset." }
        }

        if (!session?.user.emailVerified) {
            return {
                ok: false,
                message: "You must verify your email before duplicating this learnset. Please check your inbox for the verification email.",
            }
        }

        try {
            const deckId = await onCreateDuplicateLearnsetDeckWithChanges(userId, learnsetName)
            return { ok: true, deckId }
        } catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : "Failed to duplicate this learnset.",
            }
        }
    }

    const handleOpenDuplicateDialog = () => setIsOpen(true)

    return (
        <div className="flex flex-col p-4 border-b">
            <form>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1 max-w-full">
                            <Input
                                id="learnset-name"
                                type="text"
                                placeholder="Learnset Name..."
                                value={ learnsetDeckName ?? "" }
                                disabled
                            />
                        </Field>
                    </FieldGroup>
                    { session?.user && (
                        <FieldGroup className="flex flex-row justify-end gap-2">
                            <Field orientation="horizontal" className="w-auto">
                                <Button type="button" onClick={ handleOpenDuplicateDialog }>
                                    <CopyCheck className="mr-2" />
                                    Save as duplicate
                                </Button>
                                <SaveAsDuplicateDialog
                                    open={ isOpen }
                                    onOpenChange={ setIsOpen }
                                    onCreateDuplicateLearnsetDeckWithChanges={
                                        handleCreateDuplicateLearnsetDeckWithChanges
                                    }
                                />
                            </Field>
                        </FieldGroup>
                    ) }
                </FieldSet>
            </form>
        </div>
    )
}
