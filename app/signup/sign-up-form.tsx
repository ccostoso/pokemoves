import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SignUpSchemaType } from "@/lib/schemas"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

type SignUpFormProps = {
    form: UseFormReturn<SignUpSchemaType>
    onSubmit: SubmitHandler<SignUpSchemaType>
    isLoading: boolean
    errorMessage?: string
}

export default function SignUpForm({
    form,
    onSubmit,
    isLoading,
    errorMessage,
}: SignUpFormProps) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                        <FieldError>
                            {form.formState.errors.name.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        {...form.register("username")}
                    />
                    {form.formState.errors.username && (
                        <FieldError>
                            {form.formState.errors.username.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                        <FieldError>
                            {form.formState.errors.email.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                        <FieldError>
                            {form.formState.errors.password.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                    </FieldLabel>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...form.register("confirmPassword")}
                    />
                    {form.formState.errors.confirmPassword && (
                        <FieldError>
                            {form.formState.errors.confirmPassword.message}
                        </FieldError>
                    )}
                </Field>
            </FieldGroup>

            {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
        </form>
    )
}
