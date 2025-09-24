import { boolean, date, decimal, foreignKey, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./business";
import { customers } from "./customers";
import { invoices } from "./invoices";
import { bills } from "./monetary/bills";
import { chartOfAccounts } from "./monetary/others";
import { suppliers } from "./suppliers";

// Expense Receipts Table
export const expenseReceipts = pgTable(
    "expense_receipts",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        date: date("date").notNull(),
        supplierId: integer("supplier_id"),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        category: varchar("category", { length: 100 }), // e.g., rent, supplies
        paymentMethod: varchar("payment_method", { length: 50 }),
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
            name: "fkSupplier",
            columns: [table.supplierId],
            foreignColumns: [suppliers.id],
        }).onDelete("restrict"),
    ]
);

// Purchase Returns / Debit Notes Table
export const debitNotes = pgTable(
    "debit_notes",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        debitNumber: varchar("debit_number", { length: 100 }).unique().notNull(),
        date: date("date").notNull(),
        supplierId: integer("supplier_id").notNull(),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        reason: text("reason"),
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
            name: "fkSupplier",
            columns: [table.supplierId],
            foreignColumns: [suppliers.id],
        }).onDelete("restrict"),
        foreignKey({
            name: "fkBill",
            columns: [table.billId],
            foreignColumns: [bills.id],
        }).onDelete("set null"),
    ]
);
// Sales Receipts Table
export const salesReceipts = pgTable(
    "sales_receipts",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        date: date("date").notNull(),
        customerId: integer("customer_id"),
        totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
        paymentMethod: varchar("payment_method", { length: 50 }),
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
            name: "fkCustomer",
            columns: [table.customerId],
            foreignColumns: [customers.id],
        }).onDelete("restrict"),
    ]
);

// Sales Returns / Credit Notes Table
export const creditNotes = pgTable(
    "credit_notes",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        creditNumber: varchar("credit_number", { length: 100 }).unique().notNull(),
        date: date("date").notNull(),
        customerId: integer("customer_id").notNull(),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        reason: text("reason"),
        invoiceId: integer("invoice_id"), // Linked to original invoice if applicable
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
            name: "fkCustomer",
            columns: [table.customerId],
            foreignColumns: [customers.id],
        }).onDelete("restrict"),
        foreignKey({
            name: "fkInvoice",
            columns: [table.invoiceId],
            foreignColumns: [invoices.id],
        }).onDelete("set null"),
    ]
);

// General Ledger Table (Double-entry transactions)
export const generalLedger = pgTable(
    "general_ledger",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        transactionDate: date("transaction_date").notNull(),
        description: text("description"),
        accountId: integer("account_id").notNull(),
        debit: decimal("debit", { precision: 10, scale: 2 }).default("0.00"),
        credit: decimal("credit", { precision: 10, scale: 2 }).default("0.00"),
        referenceId: integer("reference_id"), // Link to invoice, bill, etc.
        referenceType: varchar("reference_type", { length: 50 }), // invoice, bill, etc.
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
            name: "fkAccount",
            columns: [table.accountId],
            foreignColumns: [chartOfAccounts.id],
        }).onDelete("restrict"),
    ]
);

// Tax Records Table (for tax filings)
export const taxRecords = pgTable(
    "tax_records",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        periodStart: date("period_start").notNull(),
        periodEnd: date("period_end").notNull(),
        taxType: varchar("tax_type", { length: 50 }), // income, sales, etc.
        amountDue: decimal("amount_due", { precision: 10, scale: 2 }),
        filed: boolean("filed").default(false),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkBusiness",
            columns: [table.businessId],
            foreignColumns: [businesses.id],
        }).onDelete("cascade"),
    ]
);
