'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'
import { Transaction } from '@prisma/client'
import { useTheme } from 'next-themes'
import { format, subDays, startOfDay } from 'date-fns'

interface IncomeExpenseChartProps {
    transactions: Transaction[]
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
    const { theme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    // Generate data for the last 7 days
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = startOfDay(subDays(new Date(), 6 - i))
        const dayTransactions = transactions.filter(
            (t) => startOfDay(new Date(t.date)).getTime() === date.getTime()
        )

        const income = dayTransactions
            .filter((t) => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0)

        const expense = dayTransactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0)

        const investment = dayTransactions
            .filter((t) => t.type === 'investment')
            .reduce((acc, curr) => acc + curr.amount, 0)

        return {
            name: format(date, 'MMM dd'),
            income,
            expense,
            investment,
        }
    })

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Cash Flow (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 min-h-[350px]">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke={isDark ? '#888888' : '#333333'}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={isDark ? '#888888' : '#333333'}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: isDark ? '#374151' : '#e5e7eb',
                                color: isDark ? '#f9fafb' : '#111827',
                            }}
                            itemStyle={{
                                color: isDark ? '#f9fafb' : '#111827'
                            }}
                        />
                        <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
                        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                        <Bar dataKey="investment" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Investment" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
