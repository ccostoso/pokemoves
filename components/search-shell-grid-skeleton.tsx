import { Skeleton } from "@/components/ui/skeleton"

type SearchShellGridSkeletonProps = {
    showSearchPanel?: boolean
}

export default function SearchShellGridSkeleton({ showSearchPanel = true }: SearchShellGridSkeletonProps) {
    return (
        <div className="mt-6 flex flex-col gap-6 md:flex-row">
            { showSearchPanel && (
                <aside className="w-full shrink-0 md:w-72">
                    { /* Mobile: collapsed panel header */ }
                    <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border px-4 py-4 md:hidden">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="size-5 rounded-sm" />
                    </div>
                    { /* md and up: full panel */ }
                    <div className="rounded-xl border p-6 max-md:hidden">
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
                    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-11 w-full md:h-8 lg:max-w-sm" />
                        { /* Mobile: collapsed "Deck actions" row */ }
                        <Skeleton className="h-11 w-full md:hidden" />
                        <div className="flex items-center gap-2 max-md:hidden">
                            <Skeleton className="h-8 w-36" />
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-28" />
                        </div>
                    </div>
                    <div className="flex justify-center pt-3 md:hidden">
                        <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="@container overflow-hidden">
                        <div className="flex gap-3 px-[9cqw] pt-4 pb-8 md:gap-4 md:px-4 md:pt-4">
                            { Array.from({ length: 3 }).map((_, index) => (
                                <div key={ index } className="w-[82cqw] shrink-0 rounded-xl border p-4 md:w-72">
                                    <div className="mb-4 flex items-start justify-between gap-2">
                                        <Skeleton className="h-6 w-36" />
                                        <Skeleton className="size-11 rounded-md md:size-8" />
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
                </div>
            </section>
        </div>
    )
}