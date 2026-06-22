import { getLevelUpMovesByPokemonNameAndGeneration } from "./actions";

export type QueryResult = Awaited<
    ReturnType<typeof getLevelUpMovesByPokemonNameAndGeneration>
> & {
    id: string // Unique ID for DnD tracking
}