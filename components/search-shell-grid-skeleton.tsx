import { Skeleton } from "@/components/ui/skeleton"

type SearchShellGridSkeletonProps = {
    showSearchPanel?: boolean
}

export default function SearchShellGridSkeleton({ showSearchPanel = true }: SearchShellGridSkeletonProps) {
    return (
        <div className="mt-6 flex gap-6">
            { showSearchPanel && (
                <aside className="w-72 shrink-0">
                    <div className="rounded-xl border p-6">
                        <Skeleton className="mx-auto h-8 w-52" />
                        <div className="mt-6 space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="mt-6 h-4 w-full" />
                    </div>
                </aside>
            ) }
            <section className="min-w-0 flex-1 overflow-x-hidden">
                <div className="rounded-xl border">
                    <div className="flex items-center justify-between gap-3 border-b p-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-9" />
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-hidden px-4 pt-4 pb-8">
                        { Array.from({ length: 3 }).map((_, index) => (
                            <div key={ index } className="w-80 shrink-0 rounded-xl border p-4">
                                <div className="mb-4 flex items-start justify-between gap-2">
                                    <Skeleton className="h-6 w-36" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                                <div className="space-y-3">
                                    { Array.from({ length: 7 }).map((_, moveIndex) => (
                                        <Skeleton key={ moveIndex } className="h-4 w-full" />
                                    )) }
                                </div>
                            </div>
                        )) }
                    </div>
                </div>
            </section>
        </div>
    )
}