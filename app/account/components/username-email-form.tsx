"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitEvent, useMemo, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { UsernameEmailUpdateSchema } from "@/lib/schemas"
import { toast } from "sonner"

export default function UsernameEmailForm({ name, email }: { name: string, email: string }) {
    const [ newName, setNewName ] = useState(name)
    const [ newEmail, setNewEmail ] = useState(email)
    const [ isUpdating, setIsUpdating ] = useState(false)

    const nameChanged = useMemo(() => newName.trim() !== name, [newName, name])
    const emailChanged = useMemo(() => newEmail.trim().toLowerCase() !== email.toLowerCase(), [newEmail, email])
    const hasChanges = nameChanged || emailChanged

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!hasChanges) return

        const parsedFormData = UsernameEmailUpdateSchema.safeParse({
            name: newName,
            email: newEmail,
        })

        if (!parsedFormData.success) {
            toast.error(parsedFormData.error.issues[0]?.message ?? "Invalid name or email.", {
                position: "top-center",
            })
            return
        }

        const validatedName = parsedFormData.data.name
        const validatedEmail = parsedFormData.data.email
        const shouldUpdateName = validatedName !== name.trim()
        const shouldUpdateEmail = validatedEmail !== email.trim().toLowerCase()

        if (!shouldUpdateName && !shouldUpdateEmail) {
            return
        }

        try {
            setIsUpdating(true)
            if (shouldUpdateName) {
                await authClient.updateUser({ name: validatedName })
            }
            if (shouldUpdateEmail) {
                await authClient.changeEmail({ 
                    newEmail: validatedEmail,
                    callbackURL: "/account",
                })
            }

            toast.success("User information updated successfully.", {
                position: "top-center",
            })
        } catch (error) {
            toast.error("Error updating user information.", {
                position: "top-center",
            })
            console.error("Error updating user:", error)
        } finally {
            setIsUpdating(false)
        }
        
    }

    return (
        <section className="mt-6">
            <h2 className="text-2xl font-bold">Name and Email</h2>
            <Card className="max-w-1/2">
                <CardContent>
                    <form onSubmit={ handleSubmit }>
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
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={ newEmail }
                                        onChange={ (e) => setNewEmail(e.target.value) }
                                        className="w-full rounded-md border border-muted-foreground p-2"
                                    />
                                    <FieldDescription>
                                        This is the email that will be used for account-related notifications and login.
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                            <Button
                                type="submit"
                                disabled={ isUpdating || !hasChanges }
                                className="mt-4"
                            >
                                { isUpdating ? "Saving..." : "Save Changes" }
                            </Button>
                        </FieldSet>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}