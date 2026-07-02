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

export const SignUpSchema = z
    .object({
        username: z
            .string()
            .min(1, { message: "Username is required" })
            .max(20, {
                message: "Username must be at most 20 characters long",
            }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters long",
            })
            .max(50, {
                message: "Password must be at most 50 characters long",
            })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
                message:
                    "Password must contain at least one letter, one number, and one special character",
            }),
        confirmPassword: z
            .string()
            .min(1, {
                message: "Confirm Password is required",
            })
            .max(50, {
                message: "Confirm Password must be at most 50 characters long",
            }),
        name: z.string().min(1, { message: "Name is required" }).max(50, {
            message: "Name must be at most 50 characters long",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type SignUpSchemaType = z.infer<typeof SignUpSchema>

export const LearnsetDeckTitleSchema = z
    .string()
    .trim()
    .min(1, { message: "Learnset name is required" })
    .max(50, {
        message: "Learnset name must be at most 50 characters long",
    })
    .refine((value) => !/[\u0000-\u001F\u007F]/.test(value), {
        message: "Learnset name contains invalid characters",
    })

export const SaveAsDuplicateSchema = z.object({
    learnsetName: LearnsetDeckTitleSchema,
})

export type SaveAsDuplicateSchemaType = z.infer<typeof SaveAsDuplicateSchema>