import { authClient } from "@/lib/auth-client"

export type SignInInput = {
    username: string
    password: string
    callbackURL?: string
}

export async function signInWithUsername(input: SignInInput) {
    return authClient.signIn.username({
        username: input.username,
        password: input.password,
        callbackURL: input.callbackURL ?? "/dashboard",
    })
}