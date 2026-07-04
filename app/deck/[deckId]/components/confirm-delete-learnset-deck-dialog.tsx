import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function ConfirmDeleteLearnsetDeckDialog({
    open,
    isDeleting,
    onOpenChange,
    onConfirmDeleteLearnsetDeck,
}: {
    open: boolean,
    isDeleting: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirmDeleteLearnsetDeck: () => Promise<void>
}) {
    return (
        <Dialog open={ open } onOpenChange={ onOpenChange }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this learnset deck?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the learnset deck from your account.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={ () => onOpenChange(false) } disabled={ isDeleting }>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={ () => void onConfirmDeleteLearnsetDeck() }
                        disabled={ isDeleting }
                    >
                        { isDeleting ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Deleting...
                            </span>
                        ) : (
                            "Delete Learnset Deck"
                        ) }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
