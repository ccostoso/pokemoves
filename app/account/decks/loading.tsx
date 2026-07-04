import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingDecksPage() {
    return (
        <main className="container mx-auto p-4 flex-1">
            <section className="mb-4 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-96" />
            </section>
            <div className="grid gap-4 py-8">
                { Array.from({ length: 3 }).map((_, index) => (
                    <Card key={ index } className="w-full border rounded p-4">
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-7 w-64" />
                            <Skeleton className="h-4 w-44" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                { Array.from({ length: 4 }).map((_, spriteIndex) => (
                                    <div key={ spriteIndex } className="rounded-lg border p-2">
                                        <Skeleton className="h-24 w-24" />
                                        <Skeleton className="mt-2 h-4 w-20" />
                                    </div>
                                )) }
                            </div>
                        </CardContent>
                    </Card>
                )) }
            </div>
        </main>
    )
}
