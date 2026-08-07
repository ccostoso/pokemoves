import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const signInWithUsernameMock = vi.hoisted(() => vi.fn())
const onOpenChangeMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/actions/auth-actions/sign-in", () => ({
    signInWithUsername: signInWithUsernameMock,
}))

const { default: SignInDialog } = await import("./sign-in-dialog")

const validInput = {
    username: "ashketchum",
    password: "Pa$$word1",
}

const fillOutForm = async (user: ReturnType<typeof userEvent.setup>, overrides: Partial<typeof validInput> = {}) => {
    const input = { ...validInput, ...overrides }

    await user.type(screen.getByLabelText("Username"), input.username)
    await user.type(screen.getByLabelText("Password"), input.password)
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe("SignInDialog", () => {
    it("submits the form and closes the dialog on success", async () => {
        signInWithUsernameMock.mockResolvedValue({ error: null })
        const user = userEvent.setup()

        render(<SignInDialog open onOpenChange={ onOpenChangeMock } />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign in" }))

        await waitFor(() => {
            expect(signInWithUsernameMock).toHaveBeenCalledWith({
                username: validInput.username,
                password: validInput.password,
                callbackURL: "/",
            })
        })
        await waitFor(() => expect(onOpenChangeMock).toHaveBeenCalledWith(false))
    })

    it("shows the server-returned error message and keeps the dialog open", async () => {
        signInWithUsernameMock.mockResolvedValue({ error: { message: "Invalid username or password" } })
        const user = userEvent.setup()

        render(<SignInDialog open onOpenChange={ onOpenChangeMock } />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign in" }))

        expect(await screen.findByText("Invalid username or password")).toBeInTheDocument()
        expect(onOpenChangeMock).not.toHaveBeenCalledWith(false)
    })

    it("shows a generic error message when the request throws", async () => {
        signInWithUsernameMock.mockRejectedValue(new Error("network down"))
        const user = userEvent.setup()

        render(<SignInDialog open onOpenChange={ onOpenChangeMock } />)
        await fillOutForm(user)
        await user.click(screen.getByRole("button", { name: "Sign in" }))

        expect(await screen.findByText("An unknown error occurred.")).toBeInTheDocument()
        expect(onOpenChangeMock).not.toHaveBeenCalledWith(false)
    })

    it("blocks submission and shows a validation error when the password is too weak", async () => {
        const user = userEvent.setup()

        render(<SignInDialog open onOpenChange={ onOpenChangeMock } />)
        await fillOutForm(user, { password: "onlylettershere" })
        await user.click(screen.getByRole("button", { name: "Sign in" }))

        expect(
            await screen.findByText("Password must contain at least one letter, one number, and one special character"),
        ).toBeInTheDocument()
        expect(signInWithUsernameMock).not.toHaveBeenCalled()
    })

    it("closes the dialog when Cancel is clicked", async () => {
        const user = userEvent.setup()

        render(<SignInDialog open onOpenChange={ onOpenChangeMock } />)
        await user.click(screen.getByRole("button", { name: "Cancel" }))

        expect(onOpenChangeMock).toHaveBeenCalledWith(false)
    })
})
