import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { getTransactions } from '@/app/actions/transaction'

export default async function TransactionsPage() {
    const transactions = await getTransactions()

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                <AddTransactionDialog />
            </div>

            <div className="flex-1">
                <TransactionsTable initialTransactions={transactions} />
            </div>
        </div>
    )
}
