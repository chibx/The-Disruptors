import { decimal, foreignKey, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./business";

// Services Table
export const services = pgTable(
    "services",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        salesPrice: decimal("sales_price", { precision: 10, scale: 2 }),
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
