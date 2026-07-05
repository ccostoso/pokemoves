"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitEvent, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { PasswordChangeSchema } from "@/lib/schemas"
import { toast } from "sonner"

export default function PasswordChangeForm() {
    const [ isUpdating, setIsUpdating ] = useState(false)
    const [ currentPassword, setCurrentPassword ] = useState("")
    const [ newPassword, setNewPassword ] = useState("")
    const [ confirmPassword, setConfirmPassword ] = useState("")

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const parsedFormData = PasswordChangeSchema.safeParse({
            currentPassword,
            newPassword,
            confirmPassword,
        })

        if (!parsedFormData.success) {
            toast.error(parsedFormData.error.issues[0]?.message ?? "Invalid password form data.", {
                position: "top-center",
            })
            return
        }

        const validatedCurrentPassword = parsedFormData.data.currentPassword
        const validatedNewPassword = parsedFormData.data.newPassword

        try {
            setIsUpdating(true)
            await authClient.changePassword({
                currentPassword: validatedCurrentPassword,
                newPassword: validatedNewPassword,
            })
            toast.success("Password updated successfully.", {
                position: "top-center",
            })
        } catch (error) {
            toast.error("Error updating password.", {
                position: "top-center",
            })
            console.error("Error updating user:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <section className="mt-6">
            <h2 className="text-2xl font-bold">Change Password</h2>
            <Card className="max-w-1/2">
                <CardContent>
                    <form onSubmit={ handleSubmit }>
                        <FieldSet className="space-y-2">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={ currentPassword }
                                        onChange={ (e) => setCurrentPassword(e.target.value) }
                                        className="w-full rounded-md border border-muted-foreground p-2"
                                    />
                                    <FieldDescription>
                                        Enter your current password to authorize the change.
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={ newPassword }
                                        onChange={ (e) => setNewPassword(e.target.value) }
                                        className="w-full rounded-md border border-muted-foreground p-2"
                                    />
                                    <FieldDescription>
                                        Enter your new password. Make sure it&apos;s strong and secure.
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={ confirmPassword }
                                        onChange={ (e) => setConfirmPassword(e.target.value) }
                                        className="w-full rounded-md border border-muted-foreground p-2"
                                    />
                                    <FieldDescription>
                                        Re-enter your new password to confirm it.
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                            <Button type="submit" disabled={ isUpdating }>
                                { isUpdating ? "Updating..." : "Update Password" }
                            </Button>
                        </FieldSet>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}