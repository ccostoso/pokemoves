import { authClient } from "@/lib/auth-client"

export async function signOut() {
    return authClient.signOut()
}
