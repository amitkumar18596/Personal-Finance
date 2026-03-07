import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { getTransactions } from '@/app/actions/transaction'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const page = Number(searchParams.page) || 1
    const pageSize = 20
    const { transactions, totalPages } = await getTransactions({ page, pageSize })

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                <AddTransactionDialog />
            </div>

            <div className="flex-1">
                <TransactionsTable
                    initialTransactions={transactions}
                    totalPages={totalPages}
                    currentPage={page}
                />
            </div>
        </div>
    )
}
