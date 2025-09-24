import { foreignKey, integer, jsonb, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { businesses } from "./business";

// Settings Table (per business)
export const settings = pgTable(
    "settings",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull().unique(),
        invoiceTemplate: jsonb("invoice_template"),
        taxRates: jsonb("tax_rates"), // Array of tax rates
        reportingPeriods: jsonb("reporting_periods"),
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
