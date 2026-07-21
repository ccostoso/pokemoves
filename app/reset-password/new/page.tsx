"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SubmitEventHandler, useMemo, useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SetNewPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSetNewPassword: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (!token) {
            toast.error("Missing or invalid reset token.", {
                position: "top-center",
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.", {
                position: "top-center",
            })
            return
        }

        setIsSubmitting(true)

        try {
            await authClient.resetPassword({ token, newPassword })
            toast.success("Password updated successfully.", {
                position: "top-center",
            })
            router.push("/")
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
            console.error("Error resetting password:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Set New Password</CardTitle>
                    <CardDescription>
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="set-new-password-form" onSubmit={ handleSetNewPassword }>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        type="password"
                                        id="new-password"
                                        value={ newPassword }
                                        onChange={ (e) => setNewPassword(e.target.value) }
                                        required
                                        className="mt-1 block w-full"
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        type="password"
                                        id="confirm-password"
                                        value={ confirmPassword }
                                        onChange={ (e) => setConfirmPassword(e.target.value) }
                                        required
                                        className="mt-1 block w-full"
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        form="set-new-password-form"
                        disabled={ isSubmitting }
                    >
                        { isSubmitting ? "Updating..." : "Update Password" }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
