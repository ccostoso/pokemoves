"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Item } from "@/components/ui/item"

type DeckItemPreview = {
    sortOrder: number
    pokemonId: number
    pokemonDisplayName: string
    versionGroupDisplayName: string
}

type DeckItemsPreviewProps = {
    items: DeckItemPreview[]
}

export function DeckItemsPreview({ items }: DeckItemsPreviewProps) {
    const scrollerRef = useRef<HTMLUListElement>(null)
    const [showLeftFade, setShowLeftFade] = useState(false)
    const [showRightFade, setShowRightFade] = useState(false)

    const updateFadeVisibility = useCallback(() => {
        const scroller = scrollerRef.current

        if (!scroller) {
            return
        }

        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth

        setShowLeftFade(scroller.scrollLeft > 2)
        setShowRightFade(maxScrollLeft - scroller.scrollLeft > 2)
    }, [])

    useEffect(() => {
        const scroller = scrollerRef.current

        if (!scroller) {
            return
        }

        updateFadeVisibility()

        const resizeObserver = new ResizeObserver(() => {
            updateFadeVisibility()
        })

        resizeObserver.observe(scroller)
        scroller.addEventListener("scroll", updateFadeVisibility, { passive: true })

        return () => {
            resizeObserver.disconnect()
            scroller.removeEventListener("scroll", updateFadeVisibility)
        }
    }, [updateFadeVisibility, items.length])

    return (
        <div className="relative">
            <ul
                ref={ scrollerRef }
                className="flex gap-2 overflow-x-auto pb-2 pr-2"
                aria-label="Deck item preview"
            >
                { items.map((item) => (
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
            { showLeftFade && (
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-card to-transparent" />
            ) }
            { showRightFade && (
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-card to-transparent" />
            ) }
        </div>
    )
}
