import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSet, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { CopyCheck } from "lucide-react"

type ViewerLearnsetToolbarProps = {
    learnsetDeckName?: string | null
}

export function ViewerLearnsetToolbar({ learnsetDeckName }: ViewerLearnsetToolbarProps) {
    const { data: session } = authClient.useSession()
    return (
        <div className="flex flex-col p-4 border-b">
            <form>
                <FieldSet className="flex flex-row justify-between">
                    <FieldGroup>
                        <Field className={ cn("flex-1", session?.user ? "max-w-full" : "max-w-1/2") }>
                            <Input id="learnset-name" type="text" placeholder="Learnset Name..." value={ learnsetDeckName ?? "" } disabled />
                        </Field>
                    </FieldGroup>
                    { session?.user && (
                        <FieldGroup className="flex flex-row justify-end gap-2">
                            <Field orientation="horizontal" className="w-auto">
                                <Button type="submit"><CopyCheck className="mr-2" />Save as duplicate</Button>
                            </Field>
                        </FieldGroup>
                    ) }
                </FieldSet>
            </form>
        </div>
    )
}