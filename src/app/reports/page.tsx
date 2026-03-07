import { getTransactions } from '@/app/actions/transaction'
import { ReportsView } from '@/components/reports/reports-view'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
    const { transactions } = await getTransactions({ limit: 1000 }) // Fetch enough history for yearly views

    return (
        <div className="h-full">
            <ReportsView transactions={transactions} />
        </div>
    )
}
