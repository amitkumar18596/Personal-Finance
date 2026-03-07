'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { addTransaction, updateTransaction } from '@/app/actions/transaction'
import { Transaction } from '@prisma/client'

const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a positive number',
    }),
    type: z.enum(['income', 'expense', 'investment']),
    category: z.string().min(1, 'Category is required'),
    date: z.string().min(1, 'Date is required'),
    note: z.string().optional(),
})
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other']
const EXPENSE_CATEGORIES = [
    'Food',
    'Rent',
    'EMI',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Health',
    'Transfer to Brother',
    'Transfer to Father',
    'Other',
]
const INVESTMENT_CATEGORIES = [
    'Stocks',
    'Mutual Funds',
    'Fixed Deposit',
    'Crypto',
    'Gold',
    'Real Estate',
    'Other',
]

interface AddTransactionDialogProps {
    transaction?: Transaction
    trigger?: React.ReactNode
}

export function AddTransactionDialog({ transaction, trigger }: AddTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: transaction?.amount.toString() || '',
            type: (transaction?.type as 'income' | 'expense' | 'investment') || 'expense',
            category: transaction?.category || '',
            date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            note: transaction?.note || '',
        },
    })

    const selectedType = form.watch('type')
    const categories = 
        selectedType === 'income' 
            ? INCOME_CATEGORIES 
            : selectedType === 'investment' 
                ? INVESTMENT_CATEGORIES 
                : EXPENSE_CATEGORIES

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('amount', values.amount)
        formData.append('type', values.type)
        formData.append('category', values.category)
        formData.append('date', new Date(values.date).toISOString())
        if (values.note) formData.append('note', values.note)

        const result = transaction
            ? await updateTransaction(transaction.id, formData)
            : await addTransaction(formData)

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            })
        } else {
            toast({
                title: 'Success',
                description: transaction ? 'Transaction updated successfully.' : 'Transaction added successfully.',
            })
            if (!transaction) form.reset()
            setOpen(false)
        }
        setIsLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val)
                                            form.setValue('category', '') // Reset category on type change
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="expense">Expense</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="investment">Investment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.00" type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Groceries, Rent, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Transaction'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
