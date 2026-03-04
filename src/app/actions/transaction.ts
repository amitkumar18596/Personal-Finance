'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function addTransaction(formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as string
    const category = formData.get('category') as string
    const date = new Date(formData.get('date') as string)
    const note = formData.get('note') as string

    if (isNaN(amount) || !type || !category || !date) {
        return { error: 'Missing required fields' }
    }

    try {
        await prisma.transaction.create({
            data: {
                amount,
                type,
                category,
                date,
                note,
            },
        })

        revalidatePath('/')
        revalidatePath('/transactions')
        revalidatePath('/reports')
        return { success: true }
    } catch (error) {
        console.error('Failed to create transaction:', error)
        return { error: 'Failed to create transaction' }
    }
}

export async function getTransactions(options?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    limit?: number;
}) {
    try {
        const where: {
            date?: { gte?: Date, lte?: Date },
            category?: { contains: string }
        } = {};

        if (options?.startDate || options?.endDate) {
            where.date = {};
            if (options.startDate) {
                where.date.gte = options.startDate;
            }
            if (options.endDate) {
                where.date.lte = options.endDate;
            }
        }

        if (options?.category) {
            where.category = { contains: options.category };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: {
                date: 'desc'
            },
            take: options?.limit
        });

        return transactions;
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return [];
    }
}

export async function deleteTransaction(id: string) {
    try {
        await prisma.transaction.delete({
            where: { id }
        });
        revalidatePath('/')
        revalidatePath('/transactions')
        revalidatePath('/reports')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { error: 'Failed to delete transaction' }
    }
}

export async function getDashboardMetrics() {
    try {
        const transactions = await prisma.transaction.findMany();

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpenses += t.amount;
            }
        });

        return {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses
        };
    } catch (error) {
        console.error('Failed to fetch metrics:', error);
        return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }
}
