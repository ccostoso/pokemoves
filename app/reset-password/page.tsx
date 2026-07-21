"use client"

import { useRouter } from "next/navigation"
import { SubmitEventHandler, useState } from "react"
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

export default function ResetPasswordPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [email, setEmail] = useState("")

    const handleResetPassword: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        setIsSubmitting(true)

        try {
            await authClient.requestPasswordReset({ email, redirectTo: "/reset-password/new" })
            toast.success("Password reset email sent!", {
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
            console.error("Error sending password reset email:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email address below, and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="reset-password-form" onSubmit={ handleResetPassword }>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="reset-password-email">Email</Label>
                                    <Input
                                        type="email"
                                        id="reset-password-email"
                                        value={ email }
                                        onChange={ (e) => setEmail(e.target.value) }
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
                        form="reset-password-form"
                        disabled={ isSubmitting }
                    >
                        { isSubmitting ? "Sending..." : "Send Reset Link" }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}