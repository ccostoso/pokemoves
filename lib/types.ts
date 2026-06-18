import { getLevelUpMovesByPokemonNameAndGeneration } from "./actions";

export type queryResult = Awaited<
    ReturnType<typeof getLevelUpMovesByPokemonNameAndGeneration>
>