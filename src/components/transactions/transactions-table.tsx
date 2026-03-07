'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { Transaction } from '@prisma/client'
import { deleteTransaction } from '@/app/actions/transaction'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AddTransactionDialog } from './add-transaction-dialog'

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
    currentPage: number
    totalPages: number
}

export function TransactionsTable({
    initialTransactions,
    currentPage,
    totalPages,
}: TransactionsTableProps) {
    const { toast } = useToast()
    const router = useRouter()
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

    const onPageChange = (page: number) => {
        router.push(`/transactions?page=${page}`)
    }

    if (initialTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card text-card-foreground shadow-sm">
                <p className="text-muted-foreground">No transactions found.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">S.No</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialTransactions.map((transaction, index) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">
                                    {(currentPage - 1) * 20 + index + 1}
                                </TableCell>
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
                                    <div className="flex justify-end gap-2">
                                        <AddTransactionDialog
                                            transaction={transaction}
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                                            onClick={() => handleDelete(transaction.id)}
                                            disabled={isDeleting === transaction.id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    )
}
