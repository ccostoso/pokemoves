"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInSchema, SignInSchemaType } from "@/lib/schemas"
import { signInWithUsername } from "@/lib/actions/auth-actions/sign-in"
import Link from "next/link"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"

type SignInDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function SignInDialog({
    open,
    onOpenChange,
}: SignInDialogProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: SignInSchemaType) => {
        setErrorMessage(null)
        setIsLoading(true)

        try {
            const { error } = await signInWithUsername({
                username: data.username,
                password: data.password,
                callbackURL: "/user/",
            })

            setIsLoading(false)

            if (error) {
                setErrorMessage(
                    error.message
                        ? error.message
                        : "An unknown error occurred.",
                )
                return
            }
        } catch (error) {
            setErrorMessage("An unknown error occurred.")
            return
        } finally {
            setIsLoading(false)
        }

        onOpenChange(false)
        router.push("/user/")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="data-open:zoom-in-100! data-open:slide-in-from-left-20 data-open:duration-600 sm:max-w-106.25">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4"
                >
                    <FieldGroup>
                        <DialogHeader>
                            <DialogTitle>Sign in</DialogTitle>
                            <DialogDescription>
                                Sign in with your username and password.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Controller
                                    name="username"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="username">
                                                Username
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="username"
                                                type="text"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="password">
                                                Password
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="password"
                                                type="password"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            {errorMessage ? (
                                <p className="text-sm text-red-600">
                                    {errorMessage}
                                </p>
                            ) : null}
                            <p className="text-muted-foreground">
                                Not a member?{" "}
                                <Link
                                    href="/signup"
                                    className="text-primary hover:underline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Click here to sign up
                                </Link>
                                .
                            </p>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={
                                    form.formState.isSubmitting || isLoading
                                }
                            >
                                {form.formState.isSubmitting || isLoading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
