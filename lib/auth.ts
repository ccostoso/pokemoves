import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import { username } from "better-auth/plugins/username"
import { admin } from "better-auth/plugins/admin"
import { after } from "next/server"
import { Resend } from "resend"
import { buildVerificationEmail } from "./email/verification-email"
import { buildPasswordResetEmail } from "./email/reset-password-email"

const resend = new Resend(process.env.RESEND_API_KEY)

const from = process.env.RESEND_FROM_EMAIL

function getRequestMetadata(request?: Request) {
    return {
        ip: request?.headers.get("x-forwarded-for") ?? "unknown",
        userAgent: request?.headers.get("user-agent") ?? "unknown",
    }
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            after(async () => {
                const { subject, html, text } = buildPasswordResetEmail(url)
                if (!process.env.RESEND_API_KEY) {
                    console.error("RESEND_API_KEY is not defined. Password reset email was not sent.", {
                        email: user.email,
                    })
                    return
                }
                if (!from) {
                    console.error("RESEND_FROM_EMAIL is not defined. Password reset email was not sent.", {
                        email: user.email,
                    })
                    return
                }

                try {
                    await resend.emails.send({
                        from,
                        to: user.email,
                        subject,
                        html,
                        text,
                    })
                } catch (error) {
                    console.error("Failed to send password reset email", { email: user.email, error })
                }
            })
        },
        onPasswordReset: async ({ user }, request) => {
            const metadata = getRequestMetadata(request)
            console.info("Password reset completed", {
                email: user.email,
                ...metadata,
            })
        },
    },
    plugins: [username(), admin()],
    user: {
        deleteUser: {
            enabled: true,
        },
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: false,
            },
        },
    },
    emailVerification: {
        enabled: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            after(async () => {
                const { subject, html, text } = buildVerificationEmail(url)
                if (!process.env.RESEND_API_KEY) {
                    console.error("RESEND_API_KEY is not defined. Verification email was not sent.", {
                        email: user.email,
                    })
                    return
                }
                if (!from) {
                    console.error("RESEND_FROM_EMAIL is not defined. Verification email was not sent.", {
                        email: user.email,
                    })
                    return
                }

                try {
                    await resend.emails.send({
                        from,
                        to: user.email,
                        subject,
                        html,
                        text,
                    })
                } catch (error) {
                    console.error("Failed to send verification email", { email: user.email, error })
                }
            })
        },
        afterEmailVerification: async (user, request) => {
            const metadata = getRequestMetadata(request)
            console.info("Email verification completed", {
                email: user.email,
                userId: user.id,
                ...metadata,
            })
        },
    },
})
