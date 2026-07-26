import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useState, useSyncExternalStore } from "react"
import SaveAsDuplicateDialog from "@/app/deck/[deckId]/components/save-as-duplicate-dialog"
import { Button } from "@/components/ui/button"
import { CopyCheck } from "lucide-react"
import { DuplicateLearnsetResult } from "@/lib/types"

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
    // Therefore, we use useSyncExternalStore to ensure that the component is only rendered on the client side, 
    // after hydration, when the session is available.
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
                    { isMounted && session?.user && (
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
