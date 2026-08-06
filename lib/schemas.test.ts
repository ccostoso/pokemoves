import { describe, expect, it } from "vitest"
import {
    EmailUpdateSchema,
    LearnsetDeckTitleSchema,
    NameUpdateSchema,
    PasswordChangeSchema,
    SaveAsDuplicateSchema,
    SignInSchema,
    SignUpSchema,
} from "./schemas"

describe("SignInSchema", () => {
    it("accepts a valid username and password", () => {
        const result = SignInSchema.safeParse({ username: "trainer", password: "Password1!" })

        expect(result.success).toBe(true)
    })

    it("rejects an empty username", () => {
        const result = SignInSchema.safeParse({ username: "", password: "Password1!" })

        expect(result.success).toBe(false)
    })

    it.each([
        ["short1!", "too short"],
        ["nouppercaseordigit!!", "missing a digit"],
        ["NoSpecialChar1", "missing a special character"],
        ["Has Space1!", "contains whitespace"],
    ])("rejects password %s (%s)", (password) => {
        const result = SignInSchema.safeParse({ username: "trainer", password })

        expect(result.success).toBe(false)
    })
})

describe("SignUpSchema", () => {
    const validSignUp = {
        username: "trainer.red",
        email: "red@example.com",
        password: "Password1!",
        confirmPassword: "Password1!",
        name: "Red",
    }

    it("accepts a fully valid sign up payload", () => {
        expect(SignUpSchema.safeParse(validSignUp).success).toBe(true)
    })

    it("rejects mismatched passwords with the error on confirmPassword", () => {
        const result = SignUpSchema.safeParse({ ...validSignUp, confirmPassword: "Different1!" })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["confirmPassword"])
        }
    })

    it("rejects an invalid email address", () => {
        expect(SignUpSchema.safeParse({ ...validSignUp, email: "not-an-email" }).success).toBe(false)
    })

    it.each([
        ["ab..cd", "consecutive separators"],
        [".leading", "starts with a separator"],
        ["trailing.", "ends with a separator"],
        ["a".repeat(21), "too long"],
    ])("rejects username %s (%s)", (username) => {
        expect(SignUpSchema.safeParse({ ...validSignUp, username }).success).toBe(false)
    })

    it("accepts usernames with letters, numbers, and internal separators", () => {
        expect(SignUpSchema.safeParse({ ...validSignUp, username: "trainer_red-99" }).success).toBe(true)
    })
})

describe("LearnsetDeckTitleSchema", () => {
    it("accepts a normal name and trims surrounding whitespace", () => {
        const result = LearnsetDeckTitleSchema.safeParse("  My Deck  ")

        expect(result.success).toBe(true)
        expect(result.data).toBe("My Deck")
    })

    it("rejects an empty or whitespace-only name", () => {
        expect(LearnsetDeckTitleSchema.safeParse("   ").success).toBe(false)
    })

    it("rejects a name longer than 50 characters", () => {
        expect(LearnsetDeckTitleSchema.safeParse("a".repeat(51)).success).toBe(false)
    })

    it("rejects a name containing control characters", () => {
        expect(LearnsetDeckTitleSchema.safeParse("My\u0000Deck").success).toBe(false)
    })
})

describe("SaveAsDuplicateSchema", () => {
    it("accepts a valid learnsetName", () => {
        expect(SaveAsDuplicateSchema.safeParse({ learnsetName: "Copy" }).success).toBe(true)
    })

    it("rejects an empty learnsetName", () => {
        expect(SaveAsDuplicateSchema.safeParse({ learnsetName: "" }).success).toBe(false)
    })
})

describe("NameUpdateSchema", () => {
    it("accepts a valid name and trims whitespace", () => {
        const result = NameUpdateSchema.safeParse({ name: "  Red  " })

        expect(result.success).toBe(true)
        expect(result.data?.name).toBe("Red")
    })

    it("rejects an empty name", () => {
        expect(NameUpdateSchema.safeParse({ name: "" }).success).toBe(false)
    })

    it("rejects a name longer than 50 characters", () => {
        expect(NameUpdateSchema.safeParse({ name: "a".repeat(51) }).success).toBe(false)
    })
})

describe("EmailUpdateSchema", () => {
    it("accepts matching emails and lowercases them", () => {
        const result = EmailUpdateSchema.safeParse({
            email: "Red@Example.com",
            confirmEmail: "RED@EXAMPLE.COM",
        })

        expect(result.success).toBe(true)
        expect(result.data).toEqual({ email: "red@example.com", confirmEmail: "red@example.com" })
    })

    it("trims surrounding whitespace before validating", () => {
        const result = EmailUpdateSchema.safeParse({
            email: " red@example.com ",
            confirmEmail: " red@example.com ",
        })

        expect(result.success).toBe(true)
        expect(result.data).toEqual({ email: "red@example.com", confirmEmail: "red@example.com" })
    })

    it("rejects mismatched emails with the error on confirmEmail", () => {
        const result = EmailUpdateSchema.safeParse({
            email: "red@example.com",
            confirmEmail: "blue@example.com",
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["confirmEmail"])
        }
    })

    it("rejects an invalid email format", () => {
        const result = EmailUpdateSchema.safeParse({ email: "not-an-email", confirmEmail: "not-an-email" })

        expect(result.success).toBe(false)
    })
})

describe("PasswordChangeSchema", () => {
    const valid = {
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
    }

    it("accepts a valid password change payload", () => {
        expect(PasswordChangeSchema.safeParse(valid).success).toBe(true)
    })

    it("rejects an empty currentPassword", () => {
        expect(PasswordChangeSchema.safeParse({ ...valid, currentPassword: "" }).success).toBe(false)
    })

    it("rejects a newPassword that fails the complexity regex", () => {
        expect(
            PasswordChangeSchema.safeParse({
                ...valid,
                newPassword: "alllowercase1",
                confirmPassword: "alllowercase1",
            }).success,
        ).toBe(false)
    })

    it("rejects mismatched new/confirm passwords with the error on confirmPassword", () => {
        const result = PasswordChangeSchema.safeParse({ ...valid, confirmPassword: "Different1!" })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["confirmPassword"])
        }
    })
})
