import { z } from "zod"

export const SignInSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
            message: "Password must contain at least one letter, one number, and one special character",
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
            })
            .regex(/^(?!.*[._-]{2})[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/, {
                message: "Username may only contain letters, numbers, '.', '_' and '-', and cannot start/end with '.', '_' or '-'",
            }),
        email: z.email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters long",
            })
            .max(50, {
                message: "Password must be at most 50 characters long",
            })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
                message: "Password must contain at least one letter, one number, and one special character",
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

export const UsernameEmailUpdateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Name is required" })
        .max(50, { message: "Name must be at most 50 characters long" }),
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .transform((value) => value.toLowerCase()),
})

export type UsernameEmailUpdateSchemaType = z.infer<typeof UsernameEmailUpdateSchema>

export const PasswordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, { message: "Current password is required" }),
        newPassword: z
            .string()
            .min(8, { message: "New password must be at least 8 characters long" })
            .max(50, { message: "New password must be at most 50 characters long" })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
                message: "New password must contain at least one letter, one number, and one special character",
            }),
        confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New password and confirm password do not match",
        path: ["confirmPassword"],
    })

export type PasswordChangeSchemaType = z.infer<typeof PasswordChangeSchema>
