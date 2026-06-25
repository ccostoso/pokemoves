import { authClient } from "@/lib/auth-client"

export type SignInInput = {
    email: string
    password: string
    callbackURL?: string
}

export async function signInWithEmail(input: SignInInput) {
    return authClient.signIn.email({
        email: input.email,
        password: input.password,
        callbackURL: input.callbackURL ?? "/dashboard",
    })
}