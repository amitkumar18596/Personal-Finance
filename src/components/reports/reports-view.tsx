'use client'

import { useState } from 'react'
import { Transaction } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from 'next-themes'
import {
    format,
    subDays,
    startOfDay,
    subWeeks,
    startOfWeek,
    subMonths,
    startOfMonth,
    subQuarters,
    startOfQuarter,
    subYears,
    startOfYear,
    isSameDay,
    isSameWeek,
    isSameMonth,
    isSameQuarter,
    isSameYear
} from 'date-fns'

interface ReportsViewProps {
    transactions: Transaction[]
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export function ReportsView({ transactions }: ReportsViewProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>('daily')
    const { theme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    // Generate chart data based on timeframe
    const getChartData = () => {
        let rawData: { name: string; date: Date; income: number; expense: number; investment: number }[] = []

        if (timeframe === 'daily') {
            rawData = Array.from({ length: 14 }).map((_, i) => { // Last 14 days
                const date = startOfDay(subDays(new Date(), 13 - i))
                return {
                    name: format(date, 'MMM dd'),
                    date: date,
                    income: 0,
                    expense: 0,
                    investment: 0
                }
            })
        } else if (timeframe === 'weekly') {
            rawData = Array.from({ length: 8 }).map((_, i) => { // Last 8 weeks
                const date = startOfWeek(subWeeks(new Date(), 7 - i))
                return {
                    name: `Week of ${format(date, 'MMM dd')}`,
                    date: date,
                    income: 0,
                    expense: 0,
                    investment: 0
                }
            })
        } else if (timeframe === 'monthly') {
            rawData = Array.from({ length: 6 }).map((_, i) => { // Last 6 months
                const date = startOfMonth(subMonths(new Date(), 5 - i))
                return {
                    name: format(date, 'MMM yyyy'),
                    date: date,
                    income: 0,
                    expense: 0,
                    investment: 0
                }
            })
        } else if (timeframe === 'quarterly') {
            rawData = Array.from({ length: 4 }).map((_, i) => { // Last 4 quarters
                const date = startOfQuarter(subQuarters(new Date(), 3 - i))
                return {
                    name: `Q${Math.floor(date.getMonth() / 3) + 1} ${format(date, 'yyyy')}`,
                    date: date,
                    income: 0,
                    expense: 0,
                    investment: 0
                }
            })
        } else if (timeframe === 'yearly') {
            rawData = Array.from({ length: 3 }).map((_, i) => { // Last 3 years
                const date = startOfYear(subYears(new Date(), 2 - i))
                return {
                    name: format(date, 'yyyy'),
                    date: date,
                    income: 0,
                    expense: 0,
                    investment: 0
                }
            })
        }

        // Populate data
        transactions.forEach(t => {
            const tDate = new Date(t.date)

            const point = rawData.find(p => {
                if (timeframe === 'daily') return isSameDay(p.date, tDate)
                if (timeframe === 'weekly') return isSameWeek(p.date, tDate)
                if (timeframe === 'monthly') return isSameMonth(p.date, tDate)
                if (timeframe === 'quarterly') return isSameQuarter(p.date, tDate)
                if (timeframe === 'yearly') return isSameYear(p.date, tDate)
                return false
            })

            if (point) {
                if (t.type === 'income') point.income += t.amount
                else if (t.type === 'investment') point.investment += t.amount
                else point.expense += t.amount
            }
        })

        return rawData
    }

    const data = getChartData()

    // Calculate totals for currently visible data
    const totals = data.reduce((acc, curr) => {
        acc.income += curr.income
        acc.expense += curr.expense
        acc.investment += curr.investment
        return acc
    }, { income: 0, expense: 0, investment: 0 })

    const netSavings = totals.income - totals.expense - totals.investment
    const savingsRate = totals.income > 0 ? ((netSavings / totals.income) * 100).toFixed(1) : 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <Tabs defaultValue="daily" onValueChange={(v) => setTimeframe(v as Timeframe)}>
                    <TabsList className="flex flex-wrap h-auto">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Period Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">₹{totals.income.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Period Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">₹{totals.expense.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Net Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            ₹{netSavings.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {savingsRate}% savings rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cash Flow Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke={isDark ? '#888888' : '#333333'}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke={isDark ? '#888888' : '#333333'}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#e5e7eb'} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }}
                                    itemStyle={{ color: isDark ? '#f9fafb' : '#111827' }}
                                    formatter={(value: unknown) => [`₹${Number(value).toFixed(2)}`, '']}
                                />
                                <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                                <Area type="monotone" dataKey="investment" name="Investment" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorInvestment)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
