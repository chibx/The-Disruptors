import { date, decimal, foreignKey, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "../business";

// Fixed Assets Table
export const fixedAssets = pgTable(
    "fixed_assets",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        purchaseDate: date("purchase_date").notNull(),
        purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
        depreciationSchedule: jsonb("depreciation_schedule"), // JSON for method, rate, etc.
        currentValue: decimal("current_value", { precision: 10, scale: 2 }),
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

// Loans and Liabilities Table
export const loans = pgTable(
    "loans",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        creditorName: varchar("creditor_name", { length: 255 }).notNull(),
        originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
        interestRate: decimal("interest_rate", { precision: 5, scale: 2 }),
        paymentSchedule: jsonb("payment_schedule"), // JSON for details
        outstandingBalance: decimal("outstanding_balance", { precision: 10, scale: 2 }).notNull(),
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

// Chart of Accounts Table
export const chartOfAccounts = pgTable(
    "chart_of_accounts",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        accountName: varchar("account_name", { length: 255 }).notNull(),
        accountType: varchar("account_type", { length: 50 }).notNull(), // asset, liability, equity, income, expense
        accountNumber: varchar("account_number", { length: 50 }),
        description: text("description"),
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
