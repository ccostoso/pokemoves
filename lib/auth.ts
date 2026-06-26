import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import { username } from "better-auth/plugins/username"
import { admin } from "better-auth/plugins/admin"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [username(), admin()],
})
