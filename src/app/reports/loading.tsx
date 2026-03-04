import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-[300px]" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
            </div>

            <Skeleton className="h-[500px] w-full" />
        </div>
    )
}
