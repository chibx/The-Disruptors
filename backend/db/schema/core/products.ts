import { decimal, foreignKey, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./business";

// Products Table (Inventory Items)
export const products = pgTable(
    "products",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        sku: varchar("sku", { length: 100 }).unique(),
        description: text("description"),
        purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
        salesPrice: decimal("sales_price", { precision: 10, scale: 2 }),
        quantityOnHand: integer("quantity_on_hand").default(0),
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
