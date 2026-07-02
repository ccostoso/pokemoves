import { Field, FieldGroup, FieldSet, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import SaveAsDuplicateDialog from "@/app/deck/[deckId]/components/save-as-duplicate-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyCheck } from "lucide-react"

type ViewerLearnsetToolbarProps = {
    learnsetDeckName?: string | null,
    onSaveAsDuplicate: (userId: string, learnsetName: string) => Promise<string>
}

export function ViewerLearnsetToolbar({ learnsetDeckName, onSaveAsDuplicate }: ViewerLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    const [isOpen, setIsOpen] = useState(false)

    const handleSaveAsDuplicate = async (learnsetName: string): Promise<string> => {
        const userId = session?.user?.id

        if (!userId) {
            throw new Error("You must be logged in to duplicate this learnset.")
        }

        return onSaveAsDuplicate(userId, learnsetName)
    }

    const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setIsOpen(true)
    }

    return (
        <div className="flex flex-col p-4 border-b">
            <form>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className="flex-1 max-w-full">
                            <Input id="learnset-name" type="text" placeholder="Learnset Name..." value={ learnsetDeckName ?? "" } disabled />
                        </Field>
                    </FieldGroup>
                    { session?.user && (
                        <FieldGroup className="flex flex-row justify-end gap-2">
                            <Field orientation="horizontal" className="w-auto">
                                <Button type="button" onClick={ handleOnClick }><CopyCheck className="mr-2" />Save as duplicate</Button>
                                <SaveAsDuplicateDialog open={ isOpen } onOpenChange={ setIsOpen } onSaveAsDuplicate={ handleSaveAsDuplicate } />
                            </Field>
                        </FieldGroup>
                    ) }
                </FieldSet>
            </form>
        </div>
    )
}