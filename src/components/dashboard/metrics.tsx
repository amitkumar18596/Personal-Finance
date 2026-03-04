'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react'

interface MetricsProps {
    metrics: {
        totalIncome: number;
        totalExpenses: number;
        balance: number;
    }
}

export function DashboardMetrics({ metrics }: MetricsProps) {
    const isPositive = metrics.balance >= 0

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        ₹{metrics.balance.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        +₹{metrics.totalIncome.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">
                        -₹{metrics.totalExpenses.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
