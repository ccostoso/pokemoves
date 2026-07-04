import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function LoadingDecksPage() {
    return (
        <main className="container mx-auto p-4 flex-1">
            <section className="mb-4 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 max-w-96 w-full" />
            </section>
            <div className="grid gap-4 py-8">
                { Array.from({ length: 3 }).map((_, index) => (
                    <Card key={ index } className="w-full">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-56" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="relative min-h-36">
                            <div className="flex gap-2 overflow-hidden pb-2 pr-2">
                                { Array.from({ length: 6 }).map((_, spriteIndex) => (
                                    <div key={ spriteIndex } className="shrink-0 rounded-xl border p-2">
                                        <Skeleton className="h-24 w-24" />
                                        <Skeleton className="mt-2 h-4 w-20" />
                                    </div>
                                )) }
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Skeleton className="h-9 w-28 rounded-md" />
                        </CardFooter>
                    </Card>
                )) }
            </div>
        </main>
    )
}
