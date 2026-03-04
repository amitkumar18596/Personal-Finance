import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-[140px]" />
            </div>

            <div className="flex-1">
                <div className="border rounded-md p-4 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
}
