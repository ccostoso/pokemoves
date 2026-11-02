import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { User } from "lucide-react"
import NavbarExpandableButton from "./navbar-expandable-button"

describe("NavbarExpandableButton", () => {
    it("uses a 44px touch target and does not expand for touch pointer entry", () => {
        const onActivate = vi.fn()

        render(
            <NavbarExpandableButton
                label="Account"
                icon={ <User /> }
                isActive={ false }
                onActivate={ onActivate }
            />,
        )

        const button = screen.getByRole("button", { name: "Account" })

        expect(button).toHaveClass("size-11")
        fireEvent.pointerEnter(button, { pointerType: "touch" })
        expect(onActivate).not.toHaveBeenCalled()
    })

    it("expands on mouse pointer entry", () => {
        const onActivate = vi.fn()

        render(
            <NavbarExpandableButton
                label="Account"
                icon={ <User /> }
                isActive={ false }
                onActivate={ onActivate }
            />,
        )

        fireEvent.pointerEnter(screen.getByRole("button", { name: "Account" }), { pointerType: "mouse" })

        expect(onActivate).toHaveBeenCalledOnce()
    })
})
