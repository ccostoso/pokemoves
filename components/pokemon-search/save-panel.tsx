import { SubmitEventHandler, useState } from "react"
import { LearnsetDeckItem, LevelUpLearnset, PokemonListItem } from "@/lib/types"
import { authClient } from "@/lib/auth-client"
import { Input } from "../ui/input"
import { createLearnsetDeck } from "@/lib/actions/db-actions"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { Spinner } from "../ui/spinner"

type SavePanelProps = {
    learnsetList: LevelUpLearnset[],
    pokemonList: PokemonListItem[],
    isSubmitting: boolean
}

export default function SavePanel({ learnsetList, pokemonList, isSubmitting }: SavePanelProps) {
    const { data: session } = authClient.useSession()
    const [learnsetDeckName, setLearnsetDeckName] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mapLevelUpLearnsetToDbFormat = (learnset: LevelUpLearnset[]): LearnsetDeckItem[] => {
        return learnset.map((item, index) => ({
            pokemonName: item.pokemonName,
            versionGroupName: item.versionGroupName,
            sortOrder: index,
        }))
    }

    const handleCreateLearnsetDeck: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        if (!session?.user) {
            setError("You must be logged in to save a learnset deck.")
            setIsSaving(false)
            return
        }
        if (!learnsetDeckName) {
            setError("Please enter a name for your learnset deck.")
            setIsSaving(false)
            return
        }
        if (pokemonList.length === 0) {
            setError("No learnset deck to save. Please add a Pokémon first.")
            setIsSaving(false)
            return
        }

        try {
            const formattedLearnset = mapLevelUpLearnsetToDbFormat(learnsetList)
            await createLearnsetDeck(learnsetDeckName, formattedLearnset)

            setLearnsetDeckName("")
            setError(null)
            alert("Learnset deck saved successfully!")
        } catch (error) {
            console.error(error)
            setError("An error occurred while saving the learnset deck.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-4">
            <CardHeader className="text-center text-2xl font-bold">
                <CardTitle>Save Learnset Deck</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={ handleCreateLearnsetDeck }>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Learnset Deck Name</FieldLabel>
                            <Input
                                id="name"
                                value={ learnsetDeckName }
                                onChange={ (e) => setLearnsetDeckName(e.target.value) }
                            />
                            <FieldDescription>
                                Enter a name for your learnset deck.
                            </FieldDescription>
                        </Field>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            variant="default" 
                            disabled={
                                isSubmitting || 
                                pokemonList.length === 0 || 
                                !learnsetDeckName 
                            }
                        >
                            { isSaving ? (
                                <span className="inline-flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    Saving...
                                </span>
                            ) : (<>
                                <Save className="mr-2 h-4 w-4" /> Save Learnset Deck
                            </>
                            ) }
                        </Button>
                        { error && <p className="text-red-500 mt-2">{ error }</p> }
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}