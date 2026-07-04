import { getServerSession } from "@/lib/auth-server"
import { deleteLearnsetDeck, getAllLearnsetDecksWithLearnsetDeckItemsByUserId } from "@/lib/actions/db-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Item } from "@/components/ui/item"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"

async function handleDeleteDeck(formData: FormData) {
    "use server"

    const deckId = formData.get("deckId")

    if (typeof deckId !== "string" || !deckId) {
        throw new Error("Invalid deck ID.")
    }

    await deleteLearnsetDeck(deckId)
}

export default async function LearnsetDecks() {
    const session = await getServerSession()
    const userId = session?.user?.id

    if (!userId) {
        notFound()
    }

    const learnsetDecks = await getAllLearnsetDecksWithLearnsetDeckItemsByUserId(userId)

    if (learnsetDecks.length === 0) {
        return (
            <main className="container mx-auto p-4 flex-1">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <h1 className="text-2xl font-bold">Learnset Decks</h1>
                    <p className="text-muted-foreground">
                        You have no learnset decks. <Link href="/" className="text-primary hover:underline">Create one</Link>{ " " }
                        to get started.
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto p-4 flex-1">
            <section className="mb-4">
                <h1 className="text-2xl font-bold">Learnset Decks</h1>
                <p className="text-muted-foreground">
                    Below are your learnset decks. Click on a deck to view its contents.
                </p>
            </section>
            <div className="grid gap-4 py-8">
                { learnsetDecks.map((deck) => {
                    
                    const updatedAtLabel = new Date(deck.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })

                    return (
                        <Card
                            key={ deck.id }
                            className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:ring-foreground/20"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-2xl font-bold">{ deck.name }</h2>
                                        <p className="text-sm text-muted-foreground">
                                            { deck.items.length } entries • Updated { updatedAtLabel }
                                        </p>
                                    </div>
                                    <form action={ handleDeleteDeck }>
                                        <input type="hidden" name="deckId" value={ deck.id } />
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            aria-label={ `Delete ${deck.name}` }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="relative min-h-36">
                                <div className="relative">
                                    <ul className="flex gap-2 overflow-hidden pr-10">
                                        { deck.items.map((item) => (
                                            <li key={ item.sortOrder } className="shrink-0">
                                                <Item variant="outline" className="flex flex-col items-center gap-2 p-2">
                                                    <Image
                                                        src={ `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemonId}.png` }
                                                        alt={ item.pokemonDisplayName }
                                                        width={ 96 }
                                                        height={ 96 }
                                                    />
                                                    <p className="text-sm text-muted-foreground">{ item.versionGroupDisplayName }</p>
                                                </Item>
                                            </li>
                                        )) }
                                    </ul>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-card to-transparent" />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={ `/deck/${deck.id}` }>Open deck <ArrowRight className="h-4 w-4" /></Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                }) }
            </div>
        </main>
    )
}
