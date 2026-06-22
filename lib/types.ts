import { getLevelUpMovesByPokemonNameAndGeneration } from "./actions";

export type queryResult = Awaited<
    ReturnType<typeof getLevelUpMovesByPokemonNameAndGeneration>
> & {
    id: string // Unique ID for DnD tracking
}