import { SubmitEventHandler, useState } from "react"
import { LearnsetDeckItemData, LevelUpLearnset } from "@/lib/types"
import { authClient } from "@/lib/auth-client"
import { Input } from "../ui/input"
import { saveLearnset } from "@/lib/actions/db-actions"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { pokemonList } from "@/lib/data/pokemon-list"
import { Spinner } from "../ui/spinner"

type SavePanelProps = {
    learnsetList: LevelUpLearnset[],
    pokemonList: typeof pokemonList,
    isSubmitting: boolean
}

export default function SavePanel({ learnsetList, pokemonList, isSubmitting }: SavePanelProps) {
    const { data: session } = authClient.useSession()
    const [learnsetName, setLearnsetName] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mapLevelUpLearsetToDbFormat = (learnset: LevelUpLearnset[]): LearnsetDeckItemData[] => {
        return learnset.map((item, index) => ({
            pokemonName: item.pokemonName,
            versionGroupName: item.versionGroupName,
            sortOrder: index,
        }))
    }

    const handleSaveLearnset: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        if (!session?.user) {
            setError("You must be logged in to save a learnset.")
            setIsSaving(false)
            return
        }
        if (!learnsetName) {
            setError("Please enter a name for your learnset.")
            setIsSaving(false)
            return
        }
        if (pokemonList.length === 0) {
            setError("No learnset to save. Please add a Pokémon first.")
            setIsSaving(false)
            return
        }

        try {
            const formattedLearnset = mapLevelUpLearsetToDbFormat(learnsetList)
            const response = await saveLearnset(session.user.id, learnsetName, formattedLearnset)

            setLearnsetName("")
            setError(null)
            alert("Learnset saved successfully!")
        } catch (error) {
            console.error(error)
            setError("An error occurred while saving the learnset.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-4">
            <CardHeader className="text-center text-2xl font-bold">
                <CardTitle>Save Learnset</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveLearnset}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Learnset Name</FieldLabel>
                            <Input
                                id="name"
                                value={learnsetName}
                                onChange={(e) => setLearnsetName(e.target.value)}
                            />
                            <FieldDescription>
                                Enter a name for your learnset.
                            </FieldDescription>
                        </Field>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            variant="default" 
                            disabled={
                                isSubmitting || 
                                pokemonList.length === 0 || 
                                !learnsetName 
                            }
                        >
                            {isSaving ? (
                                <span className="inline-flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    Loading Pokemon list...
                                </span>
                            ) : (<>
                                <Save className="mr-2 h-4 w-4" /> Save Learnset
                            </>
                            )}
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}