"use client"

import { SubmitEventHandler, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function DeleteAccountForm() {
    const [ isDeleting, setIsDeleting ] = useState(false)
    const [ password, setPassword ] = useState("")

    const handleDeleteAccount: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        setIsDeleting(true)

        try {
            await authClient.deleteUser({ password, callbackURL: "/" })
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: "top-center",
                })
            } else {
                toast.error("An unknown error occurred.", {
                    position: "top-center",
                })
            }
            console.error("Error deleting user:", error)
        } finally {
            setIsDeleting(false)
        }
    }


    return (
        <section className="mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
            <Card className="max-w-1/2">
                <CardHeader>
                    <p className="text-sm text-muted-foreground">
                        Deleting your account is permanent and cannot be undone. Please enter your password to confirm.
                    </p>
                </CardHeader>
                <CardContent>
                    <form id="delete-account-form" onSubmit={ handleDeleteAccount }>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="delete-account-password" className="text-destructive">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        type="password"
                                        id="delete-account-password"
                                        value={ password }
                                        onChange={ (e) => setPassword(e.target.value) }
                                        required
                                        className="mt-1 block w-full border-destructive focus:border-destructive focus:ring-destructive"
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button 
                        type="submit" 
                        form="delete-account-form" 
                        disabled={ isDeleting || !password }>
                        { isDeleting ? "Deleting..." : "Delete Account" }
                    </Button>
                </CardFooter>
            </Card>
        </section>
    )
}