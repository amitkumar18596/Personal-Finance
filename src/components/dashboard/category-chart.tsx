'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Transaction } from '@prisma/client'
import { useTheme } from 'next-themes'

interface CategoryChartProps {
    transactions: Transaction[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']

export function CategoryChart({ transactions }: CategoryChartProps) {
    const { theme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const expenses = transactions.filter(t => t.type === 'expense')

    const categories = expenses.reduce((acc, curr) => {
        if (!acc[curr.category]) {
            acc[curr.category] = 0
        }
        acc[curr.category] += curr.amount
        return acc
    }, {} as Record<string, number>)

    const data = Object.entries(categories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

    if (data.length === 0) {
        return (
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
                    No expense data available.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: unknown) => `₹${Number(value).toFixed(2)}`}
                            contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: isDark ? '#374151' : '#e5e7eb',
                                color: isDark ? '#f9fafb' : '#111827',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
