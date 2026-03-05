<<<<<<< HEAD
# Personal Finance Tracker

A modern, responsive full-stack web application designed to track and manage personal finances.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

## Features
- **Dashboard Overview:** Visual representation of Total Balance, Income, and Expenses.
- **Transaction Log:** Easily log new incomes and expenses utilizing a categorical dropdown.
- **Dynamic Charts:** Expense pie charts and Income vs Expense bar charts utilizing Recharts.
- **Reporting:** View historical trends toggling between Daily, Weekly, Monthly, Quarterly, and Yearly.
- **Dark Mode:** Built-in Light/Dark mode toggles using Next-Themes and Tailwind.
- **Responsive Navigation:** A cleanly formatted sidebar for simple routing (collapses into a hamburger menu on smaller devices).
- **Client Form Validation:** robust form checking with React-Hook-Form and Zod.

## Technologies
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database ORM:** Prisma
- **Database:** SQLite (default for development ease)
- **Charts:** Recharts
- **Icons:** Lucide-React
- **Date Handling:** Date-fns

## Getting Started

Follow these instructions to run the project locally.

### 1. Requirements
- **Node.js**: v18 or later.

### 2. Install Dependencies
Navigate into the project directory and install the required NPM packages.

```bash
npm install
```

### 3. Database Setup (Prisma SQLite)
The application utilizes SQLite natively for immediate plug-and-play development.

Run the initial Prisma migration to construct the database schema:
```bash
npx prisma migrate dev --name init
```

Generate the Prisma Client so that Next.js Server Actions can utilize the types:
```bash
npx prisma generate
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

To deploy this application to a production environment (like Vercel), you should migrate from the local SQLite database to a PostgreSQL cluster (such as generic Vercel Postgres, Supabase, or Render).

### Migration Steps for Production
1. In `prisma/schema.prisma`, update the provider from `"sqlite"` to `"postgresql"`.
2. Grab a connection string for your new PostgreSQL instance and add it to your deployed `.env` file as `DATABASE_URL`.
3. In your deployment pipeline, ensure you run `npx prisma migrate deploy` followed by `npx prisma generate` before the `next build` command executes.
=======
# Personal-Finance
Records all my income/expenditure record from March 2026
>>>>>>> 5cf84ca5ce438c30ac055f1e822df2c1681954dc
