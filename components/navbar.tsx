import { CircleQuestionMark, Pencil, User } from "lucide-react"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
    return (
        <nav className="bg-background text-foreground p-4 border-b border-foreground/20">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="text-xl font-bold">Pokémoves</div>
                <div className="flex items-center gap-3 md:gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="group w-8 origin-left overflow-hidden px-0 gap-0 transition-all duration-300 hover:w-28 hover:px-4 hover:gap-2 focus-visible:w-28 focus-visible:px-4 focus-visible:gap-2"
                    >
                        <User className="h-5 w-5 shrink-0" />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-16 group-focus-visible:max-w-16">
                            Account
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="group w-8 origin-left overflow-hidden px-0 gap-0 transition-all duration-300 hover:w-24 hover:px-4 hover:gap-2 focus-visible:w-24 focus-visible:px-4 focus-visible:gap-2"
                    >
                        <CircleQuestionMark className="h-5 w-5 shrink-0" />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-16 group-focus-visible:max-w-16">
                            About
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="group w-8 origin-left overflow-hidden px-0 gap-0 transition-all duration-300 hover:w-28 hover:px-4 hover:gap-2 focus-visible:w-28 focus-visible:px-4 focus-visible:gap-2"
                    >
                        <Pencil className="h-5 w-5 shrink-0" />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-16 group-focus-visible:max-w-16">
                            Contact
                        </span>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    )
}
