import { z } from "zod"

export const SignInSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
            message:
                "Password must contain at least one letter, one number, and one special character",
        }),
})

export type SignInSchemaType = z.infer<typeof SignInSchema>
