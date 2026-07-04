import { getServerSession } from "@/lib/auth-server"
import { getAllLearnsetDecksWithLearnsetDeckItemsByUserId } from "@/lib/actions/db-actions"
import { notFound } from "next/navigation"
import Link from "next/dist/client/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Item } from "@/components/ui/item"
import Image from "next/image"

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
                        You have no learnset decks. <Link href="/" className="text-primary hover:underline">Create one</Link> to get started.
                    </p>
                </div>
            </main>
        )
    }

    // const pokemonSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item?.pokemon?.[0]?.id}.png`

    return (
        <main className="container mx-auto p-4 flex-1">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                { learnsetDecks.map((deck) => (
                    <Card key={ deck.id } className="border rounded p-4 w-full">
                        <CardHeader>
                            <h2 className="text-xl font-bold">{ deck.name }</h2>
                        </CardHeader>
                        <CardContent>
                            <ul className="flex justify-start gap-2">
                                { deck.items.map((item) => (
                                    <li key={ item.sortOrder }>
                                        <Item variant="outline">
                                            <Image
                                                src={ `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemonId}.png` }
                                                alt={ item.pokemonName }
                                                width={ 96 }
                                                height={ 96 }
                                                className="mr-2"
                                            />
                                            { item.pokemonName } ({ item.versionGroupName })
                                        </Item>
                                    </li>
                                )) }
                            </ul>
                        </CardContent>
                    </Card>
                )) }
                <pre>{ JSON.stringify(learnsetDecks, null, 2) }</pre>
            </div>
        </main>
    )
}
