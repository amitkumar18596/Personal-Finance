import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTransactions } from '@/app/actions/transaction'
import { format } from 'date-fns'

export async function RecentTransactions() {
    const transactions = await getTransactions({ limit: 5 })

    if (!transactions.length) {
        return (
            <Card className="col-span-7">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No transactions found. Add a new transaction to see it here.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-7">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
