import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import NavbarExpandableButton from "../navbar/navbar-expandable-button"
import { CircleQuestionMark } from "lucide-react"

type AboutDialogProps = {
    activeButton: string | null,
    setActiveButton: (button: string | null) => void
}

export default function AboutDialog({ activeButton, setActiveButton }: AboutDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <NavbarExpandableButton
                    label="About"
                    icon={ <CircleQuestionMark className="shrink-0 h-5 w-5" /> }
                    isActive={ activeButton === "about" }
                    onActivate={ () => setActiveButton("about") }
                    expandedWidthClass="w-24"
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">About Pokémoves</DialogTitle>
                    <DialogDescription className="space-y-4 text-foreground">
                        <p>
                            One day, while playing Pokémon Yellow, I found myself debating whether to evolve a Charmander right away, or to wait a few levels to learn stronger moves like Flamethrower a bit earlier. I turned to the internet, where there are no shortages of learnset guides, but having to flip back and forth, or open two/three tabs to compare learnsets for Charmander, Charmeleon and Charizard became cumbersome.
                        </p>
                        <p>
                            I figured that this was something I&apos;d probably find myself doing quite often, and that&apos;s how this project was born: why not build an app to allow me to compare these learnsets at a glance, and save the comparisons for later reference? It could also be useful for sharing with others, so they could see the same comparisons I made, or make their own.
                        </p>
                    </DialogDescription>
                    <DialogTitle className="text-2xl font-bold mt-6">How does it work?</DialogTitle>
                    <DialogDescription className="space-y-4 text-foreground">
                        <p>
                            On the left, you&apos;ll find a search panel, where you can select a Pokémon and the version of the game you&apos;re playing. Keep in mind that learnsets may vary between versions, even within the same generation, so be sure to select the correct one. 
                        </p>
                        <p>
                            Once you&apos;ve selected a Pokémon and version, click on <strong>Add to Panel</strong> to view the learnset in the right-side panel. You can add multiple Pokémon to the panel, and they will be displayed in a table format for easy comparison. You can also remove Pokémon from the panel by clicking on the <strong>X</strong> button next to their name.
                        </p>
                        <p>
                            If you&apos;re logged in, you can save your comparisons for later reference. Simply click on the <strong>Save learnset deck</strong> button, and your comparison will be saved to your account. You can access your saved comparisons from the <strong>Decks</strong> section in the <strong>Account</strong> dropdown menu.
                        </p>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}