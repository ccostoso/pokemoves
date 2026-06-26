import { User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import NavbarExpandableButton from "./navbar-expandable-button"

type AccountDropdownMenuProps = {
    activeButton: string | null
    setActiveButton: (button: string | null) => void
    isAccountMenuOpen: boolean
    handleAccountMenuOpenChange: (open: boolean) => void
}

export default function AccountDropdownMenu({
    activeButton,
    setActiveButton,
    isAccountMenuOpen,
    handleAccountMenuOpenChange,
}: AccountDropdownMenuProps) {
    return (
        <DropdownMenu onOpenChange={handleAccountMenuOpenChange}>
            <DropdownMenuTrigger asChild>
                <NavbarExpandableButton
                    label="Account"
                    icon={<User className="shrink-0 h-5 w-5" />}
                    isActive={activeButton === "account" || isAccountMenuOpen}
                    onActivate={() => setActiveButton("account")}
                    expandedWidthClass="w-28"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
