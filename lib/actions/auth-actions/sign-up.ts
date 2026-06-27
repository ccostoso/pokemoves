import { authClient } from "@/lib/auth-client"

export type SignUpInput = {
    email: string,
    username: string,
    password: string,
    name: string,
    image?: string,
    callbackURL?: string
}

export async function signUpWithEmail(input: SignUpInput) {
    return authClient.signUp.email({
        email: input.email,
        username: input.username,
        password: input.password,
        name: input.name,
        image: input.image,
        callbackURL: input.callbackURL ?? "/dashboard",
    })
}
