import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const signUpWithEmailMock = vi.hoisted(() => vi.fn())
const pushMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/actions/auth-actions/sign-up", () => ({
    signUpWithEmail: signUpWithEmailMock,
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}))

const { default: SignUpPage } = await import("./page")

const validInput = {
    name: "Ash Ketchum",
    username: "ashketchum",
    email: "ash@example.com",
    password: "Pa$$word1",
    confirmPassword: "Pa$$word1",
}

const fillOutForm = async (user: ReturnType<typeof userEvent.setup>, overrides: Partial<typeof validInput> = {}) => {
    const input = { ...validInput, ...overrides }

    await user.type(screen.getByLabelText("Name"), input.name)
    await user.type(screen.getByLabelText("Username"), input.username)
    await user.type(screen.getByLabelText("Email"), input.email)
    await user.type(screen.getByLabelText("Password"), input.password)
    await user.type(screen.getByLabelText("Confirm Password"), input.confirmPassword)
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe("SignUpPage", () => {
    it("submits the form and redirects to / on success", async () => {
        signUpWithEmailMock.mockResolvedValue({ error: null })
        const user = userEvent.setup()

        render(<SignUpPage />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign Up" }))

        await waitFor(() => {
            expect(signUpWithEmailMock).toHaveBeenCalledWith({
                email: validInput.email,
                username: validInput.username,
                password: validInput.password,
                name: validInput.name,
                callbackURL: "/",
            })
        })
        await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"))
    })

    it("shows the server-returned error message and does not redirect", async () => {
        signUpWithEmailMock.mockResolvedValue({ error: { message: "Username already taken" } })
        const user = userEvent.setup()

        render(<SignUpPage />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign Up" }))

        expect(await screen.findByText("Username already taken")).toBeInTheDocument()
        expect(pushMock).not.toHaveBeenCalled()
    })

    it("shows a generic error message when the request throws", async () => {
        signUpWithEmailMock.mockRejectedValue(new Error("network down"))
        const user = userEvent.setup()

        render(<SignUpPage />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign Up" }))

        expect(await screen.findByText("An unknown error occurred.")).toBeInTheDocument()
        expect(pushMock).not.toHaveBeenCalled()
    })

    it("blocks submission and shows validation errors when passwords do not match", async () => {
        const user = userEvent.setup()

        render(<SignUpPage />)
        await fillOutForm(user, { confirmPassword: "Different1!" })
        await user.click(screen.getByRole("button", { name: "Sign Up" }))

        expect(await screen.findByText("Passwords do not match")).toBeInTheDocument()
        expect(signUpWithEmailMock).not.toHaveBeenCalled()
    })

    it("disables the submit button and shows loading text while submitting", async () => {
        let resolveSignUp!: (value: { error: null }) => void
        signUpWithEmailMock.mockReturnValue(
            new Promise((resolve) => {
                resolveSignUp = resolve
            }),
        )
        const user = userEvent.setup()

        render(<SignUpPage />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign Up" }))

        expect(await screen.findByRole("button", { name: "Signing Up..." })).toBeDisabled()

        resolveSignUp({ error: null })
        await waitFor(() => expect(pushMock).toHaveBeenCalled())
    })
})
