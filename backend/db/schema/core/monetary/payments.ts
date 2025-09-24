import { boolean, date, decimal, foreignKey, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "../business";
import { invoices } from "../invoices";
import { bankAccounts } from "./accounts";
import { bills } from "./bills";

// Payments Made Table
export const paymentsMade = pgTable(
    "payments_made",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        date: date("date").notNull(),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        paymentMethod: varchar("payment_method", { length: 50 }),
        billId: integer("bill_id"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkBusiness",
            columns: [table.businessId],
            foreignColumns: [businesses.id],
        }).onDelete("cascade"),
        foreignKey({
            name: "fkBill",
            columns: [table.billId],
            foreignColumns: [bills.id],
        }).onDelete("set null"),
    ]
);

// Payments Received Table
export const paymentsReceived = pgTable(
    "payments_received",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        date: date("date").notNull(),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        paymentMethod: varchar("payment_method", { length: 50 }),
        invoiceId: integer("invoice_id"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkBusiness",
            columns: [table.businessId],
            foreignColumns: [businesses.id],
        }).onDelete("cascade"),
        foreignKey({
            name: "fkInvoice",
            columns: [table.invoiceId],
            foreignColumns: [invoices.id],
        }).onDelete("set null"),
    ]
);

// Bank Transactions Table (for synced or manual entries)
export const bankTransactions = pgTable(
    "bank_transactions",
    {
        id: serial("id").primaryKey(),
        bankAccountId: integer("bank_account_id").notNull(),
        date: date("date").notNull(),
        description: text("description"),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // positive for credit, negative for debit
        reconciled: boolean("reconciled").default(false),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkBusiness",
            columns: [table.bankAccountId],
            foreignColumns: [bankAccounts.id],
        }).onDelete("cascade"),
    ]
);

// Bank Reconciliations Table
export const bankReconciliations = pgTable(
    "bank_reconciliations",
    {
        id: serial("id").primaryKey(),
        bankAccountId: integer("bank_account_id").notNull(),
        statementDate: date("statement_date").notNull(),
        statementBalance: decimal("statement_balance", { precision: 10, scale: 2 }).notNull(),
        reconciledBalance: decimal("reconciled_balance", { precision: 10, scale: 2 }),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkBankAccount",
            columns: [table.bankAccountId],
            foreignColumns: [bankAccounts.id],
        }).onDelete("cascade"),
    ]
);
