import { foreignKey, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "../business";

// Bank Accounts Table
export const bankAccounts = pgTable(
    "bank_accounts",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        bankName: varchar("bank_name", { length: 255 }),
        accountName: varchar("account_name", { length: 255 }),
        accountNumber: varchar("account_number", { length: 100 }).unique(),
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

// Cash Accounts Table (e.g., petty cash)
export const cashAccounts = pgTable(
    "cash_accounts",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        accountName: varchar("account_name", { length: 255 }),
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
