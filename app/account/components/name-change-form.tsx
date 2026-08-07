"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitEvent, useMemo, useState } from "react"
import { authClient } from "@/lib/auth/auth-client"
import { NameUpdateSchema } from "@/lib/schemas"
import { toast } from "sonner"

export default function NameChangeForm({ name }: { name: string }) {
    const [ newName, setNewName ] = useState(name)
    const [ isUpdating, setIsUpdating ] = useState(false)

    const nameChanged = useMemo(() => newName.trim() !== name, [newName, name])

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!nameChanged) return

        const parsedFormData = NameUpdateSchema.safeParse({
            name: newName,
        })

        if (!parsedFormData.success) {
            toast.error(parsedFormData.error.issues[0]?.message ?? "Invalid name.", {
                position: "top-center",
            })
            return
        }

        const validatedName = parsedFormData.data.name

        try {
            setIsUpdating(true)
            await authClient.updateUser({ name: validatedName })
            toast.success("Name updated successfully.", {
                position: "top-center",
            })
        } catch (error) {
            toast.error("Error updating name.", {
                position: "top-center",
            })
            console.error("Error updating name:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <section className="mt-6 space-y-4">
            <h2 className="text-2xl font-bold">Change Display Name</h2>
            <Card className="max-w-1/2">
                <CardContent>
                    <form id="name-change-form" onSubmit={ handleSubmit }>
                        <FieldSet className="space-y-2">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={ newName }
                                        onChange={ (e) => setNewName(e.target.value) }
                                        className="w-full rounded-md border border-muted-foreground p-2"
                                    />
                                    <FieldDescription>
                                        This is the name that will be displayed on your profile and in your account settings.
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button
                        type="submit"
                        form="name-change-form"
                        disabled={ isUpdating || !nameChanged }
                    >
                        { isUpdating ? "Saving..." : "Save Changes" }
                    </Button>
                </CardFooter>
            </Card>
        </section>
    )
}
