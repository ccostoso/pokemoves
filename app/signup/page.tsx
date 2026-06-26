"use client"

import { signUpWithEmail } from "@/lib/actions/auth-actions/sign-up"
import { SignUpSchema, SignUpSchemaType } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import SignUpForm from "./sign-up-form"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { User } from "lucide-react"

export default function SignUpPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    })

    const onSubmit = async (data: SignUpSchemaType) => {
        setErrorMessage(null)
        setIsLoading(true)

        try {
            const { error } = await signUpWithEmail({
                email: data.email,
                username: data.username,
                password: data.password,
                name: data.name,
                callbackURL: "/",
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

        router.push("/")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center text-2xl font-bold">
                    <h1>Create an account</h1>
                </CardHeader>
                <CardContent>
                    <SignUpForm
                        form={form}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        errorMessage={errorMessage || undefined}
                    />
                </CardContent>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? Click on{" "}
                        <User className="inline-block h-4 w-4" /> in the top
                        right corner to sign in.
                    </p>
                </CardFooter>
                {/* </div> */}
            </Card>
        </div>
    )
}
