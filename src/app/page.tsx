

import { DashboardMetrics } from '@/components/dashboard/metrics'
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog'
import { getDashboardMetrics, getTransactions } from './actions/transaction'

export default async function Home() {
  const metrics = await getDashboardMetrics()
  const transactions = await getTransactions({ limit: 100 }) // Fetch reasonable amount for charts

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <AddTransactionDialog />
      </div>

      <DashboardMetrics metrics={metrics} />

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <IncomeExpenseChart transactions={transactions} />
        <CategoryChart transactions={transactions} />
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <RecentTransactions />
      </div>
    </div>
  )
}
