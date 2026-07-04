"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { deleteLearnsetDeck } from "@/lib/actions/db-actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type DeleteDeckButtonProps = {
    deckId: string,
    deckName: string
}

export function DeleteDeckButton({ deckId, deckName }: DeleteDeckButtonProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleConfirmDelete = () => {
        startTransition(async () => {
            await deleteLearnsetDeck(deckId)
            setOpen(false)
            router.refresh()
        })
    }

    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={ `Delete ${deckName}` }
                            onClick={ () => setOpen(true) }
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={ 8 }>
                        Delete deck
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete deck?</DialogTitle>
                    <DialogDescription>
                        { `This will permanently delete "${deckName}" and all its entries. This action cannot be undone.` }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={ isPending }>Cancel</Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={ handleConfirmDelete }
                        disabled={ isPending }
                    >
                        { isPending ? "Deleting..." : "Delete deck" }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
