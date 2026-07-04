"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitEvent, useState } from "react"
import { authClient } from "@/lib/auth-client"

export default function UsernameEmailForm({ username, email }: { username: string, email: string }) {
    const [ name, setName ] = useState(username)
    const [ isUpdating, setIsUpdating ] = useState(false)
    const [ newEmail, setNewEmail ] = useState(email)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Updated Name:", name)
        console.log("Updated Email:", newEmail)

        try {
            setIsUpdating(true)
            const [updateUserResponse, changeEmailResponse] = await Promise.all([
                authClient.updateUser({ name }), 
                authClient.changeEmail({ newEmail, callbackURL: "/account" })
            ])
            console.log("Update response:", updateUserResponse, changeEmailResponse)
        } catch (error) {
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
                                        value={ name }
                                        onChange={ (e) => setName(e.target.value) }
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
                                disabled={ isUpdating }
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