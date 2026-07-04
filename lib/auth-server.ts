import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getServerSession(): Promise<Awaited<ReturnType<typeof auth.api.getSession>>> {
    return auth.api.getSession({ headers: await headers() })
}
