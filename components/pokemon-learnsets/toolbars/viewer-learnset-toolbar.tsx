import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/auth-client"
import { useState, useSyncExternalStore } from "react"
import SaveAsDuplicateDialog from "@/app/deck/[deckId]/components/save-as-duplicate-dialog"
import { Button } from "@/components/ui/button"
import { CopyCheck } from "lucide-react"
import { DuplicateLearnsetResult } from "@/lib/types"
import { ToolbarActions } from "./toolbar-actions"

type ViewerLearnsetToolbarProps = {
    learnsetDeckName?: string | null,
    onCreateDuplicateLearnsetDeckWithChanges: (userId: string, learnsetName: string) => Promise<string>
}

// This is a no-op subscribe function for useSyncExternalStore, since we don't need to subscribe to any external 
// store in this case.
const emptySubscribe = () => () => {}

export function ViewerLearnsetToolbar({
    learnsetDeckName,
    onCreateDuplicateLearnsetDeckWithChanges,
}: ViewerLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [isOpen, setIsOpen] = useState(false)

    // viewer-learnset-toolbar.tsx conditionally renders a whole <FieldGroup> 
    // (the "Save as duplicate" button) with { session?.user && (...) }. session comes from 
    // authClient.useSession(), a client-only hook — the server always renders without a session, 
    // but if the client already has a cached session synchronously available, it renders that extra 
    // FieldGroup during hydration itself, mismatching the server HTML.
    // Therefore, we gate the "Save as duplicate" FieldGroup behind a mount check so it only appears after hydration.
    // This prevents server/client HTML mismatches when the client has a cached session available during hydration.
    const isMounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    )

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
                <FieldSet className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                    <FieldGroup>
                        <Field className="flex-1 max-w-full">
                            <Input
                                id="learnset-name"
                                className="max-md:h-11"
                                type="text"
                                placeholder="Learnset Name..."
                                value={ learnsetDeckName ?? "" }
                                disabled
                            />
                        </Field>
                    </FieldGroup>
                    { isMounted && session?.user && (
                        <ToolbarActions>
                            <FieldGroup className="flex flex-row flex-wrap justify-start gap-2 lg:justify-end">
                                <Field orientation="horizontal" className="w-auto max-md:w-full">
                                    <Button className="max-md:h-11 max-md:w-full" type="button" onClick={ handleOpenDuplicateDialog }>
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
                        </ToolbarActions>
                    ) }
                </FieldSet>
            </form>
        </div>
    )
}
