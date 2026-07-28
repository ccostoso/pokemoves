"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitEvent, useMemo, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { EmailUpdateSchema } from "@/lib/schemas"
import { toast } from "sonner"

export default function EmailChangeForm({ email }: { email: string }) {
    const [ newEmail, setNewEmail ] = useState(email)
    const [ confirmEmail, setConfirmEmail ] = useState("")
    const [ isUpdating, setIsUpdating ] = useState(false)

    const emailChanged = useMemo(() => newEmail.trim().toLowerCase() !== email.toLowerCase(), [newEmail, email])

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!emailChanged) return

        const parsedFormData = EmailUpdateSchema.safeParse({
            email: newEmail,
            confirmEmail,
        })

        if (!parsedFormData.success) {
            toast.error(parsedFormData.error.issues[0]?.message ?? "Invalid email.", {
                position: "top-center",
            })
            return
        }

        const validatedEmail = parsedFormData.data.email

        try {
            setIsUpdating(true)
            await authClient.changeEmail({
                newEmail: validatedEmail,
                callbackURL: "/account",
            })

            toast.success(`If ${validatedEmail} is available, we've sent a confirmation link to ${email} to continue the change. If nothing arrives within a few minutes, that address may already be in use.`, {
                position: "top-center",
            })
        } catch (error) {
            toast.error("Error updating email.", {
                position: "top-center",
            })
            console.error("Error updating email:", error)
        } finally {
            setIsUpdating(false)
        }
        
    }

    return (
        <section className="mt-6 space-y-4">
            <h2 className="text-2xl font-bold">Change Email</h2>
            <Card className="max-w-1/2">
                <CardContent>
                    <form id="email-change-form" onSubmit={ handleSubmit }>
                        <FieldSet className="space-y-2">
                            <FieldGroup>
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
                                <Field>
                                    <FieldLabel htmlFor="confirm-email">Confirm Email</FieldLabel>
                                    <Input
                                        id="confirm-email"
                                        type="email"
                                        value={ confirmEmail }
                                        onChange={ (e) => setConfirmEmail(e.target.value) }
                                        className="w-full rounded-md border border-muted-foreground p-2"
                                    />
                                    <FieldDescription>
                                        Confirm your new email address. A confirmation email will be sent to your current address; once confirmed, a second email will be sent to your new address to verify the change.
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button
                        type="submit"
                        form="email-change-form"
                        disabled={ isUpdating || !emailChanged }
                    >
                        { isUpdating ? "Saving..." : "Save Changes" }
                    </Button>
                </CardFooter>
            </Card>
        </section>
    )
}