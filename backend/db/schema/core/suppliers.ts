import { foreignKey, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./business";

// Suppliers Table
export const suppliers = pgTable(
    "suppliers",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        phone: varchar("phone", { length: 50 }),
        email: varchar("email", { length: 255 }),
        address: text("address"),
        paymentTerms: varchar("payment_terms", { length: 100 }), // e.g., Net 45
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
