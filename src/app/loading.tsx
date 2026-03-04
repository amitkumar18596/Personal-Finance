import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />

            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
            </div>

            <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] w-full" />
                <Skeleton className="col-span-3 h-[400px] w-full" />
            </div>

            <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
                <Skeleton className="col-span-7 h-[300px] w-full" />
            </div>
        </div>
    )
}
