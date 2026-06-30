import { getTypeNumber } from "@/lib/utils"
import Image from "next/image"

type TypeSpriteProps = {
    typeName: string
}

export default function TypeSprite({ typeName }: TypeSpriteProps) {
    const typeNumber = getTypeNumber(typeName)
    const typeSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/types/generation-vii/sun-moon/${typeNumber}.png`

    return (
        <Image
            src={ typeSpriteUrl }
            alt={ typeName }
            className="mx-auto"
            width={ 48 }
            height={ 48 }
        />
    )
}
