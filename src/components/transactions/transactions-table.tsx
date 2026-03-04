'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Transaction } from '@prisma/client'
import { deleteTransaction } from '@/app/actions/transaction'
import { useToast } from '@/hooks/use-toast'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface TransactionsTableProps {
    initialTransactions: Transaction[]
}

export function TransactionsTable({ initialTransactions }: TransactionsTableProps) {
    const { toast } = useToast()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        setIsDeleting(id)
        const result = await deleteTransaction(id)

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete transaction.',
            })
        } else {
            toast({
                title: 'Success',
                description: 'Transaction deleted successfully.',
            })
        }
        setIsDeleting(null)
    }

    if (initialTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card text-card-foreground shadow-sm">
                <p className="text-muted-foreground">No transactions found.</p>
            </div>
        )
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${transaction.type === 'income'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                                    }`}>
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                            </TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {transaction.note || '-'}
                            </TableCell>
                            <TableCell
                                className={`text-right font-medium ${transaction.type === 'income'
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                    }`}
                            >
                                {transaction.type === 'income' ? '+' : '-'}₹
                                {transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    onClick={() => handleDelete(transaction.id)}
                                    disabled={isDeleting === transaction.id}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
