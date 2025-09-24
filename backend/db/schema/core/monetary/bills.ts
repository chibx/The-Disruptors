import { date, decimal, foreignKey, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "../business";
import { products } from "../products";
import { services } from "../services";
import { suppliers } from "../suppliers";

// Bills Table
export const bills = pgTable(
    "bills",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        billNumber: varchar("bill_number", { length: 100 }).unique().notNull(),
        date: date("date").notNull(),
        dueDate: date("due_date").notNull(),
        supplierId: integer("supplier_id").notNull(),
        totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
        taxes: decimal("taxes", { precision: 10, scale: 2 }).default("0.00"),
        paymentStatus: varchar("payment_status", { length: 50 }).default("unpaid"),
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

// Bill Items Table
export const billItems = pgTable(
    "bill_items",
    {
        id: serial("id").primaryKey(),
        billId: integer("bill_id").notNull(),
        itemType: varchar("item_type", { length: 50 }).notNull(), // product or service
        productId: integer("product_id"),
        serviceId: integer("service_id"),
        quantity: integer("quantity").default(1),
        price: decimal("price", { precision: 10, scale: 2 }).notNull(),
        total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    },
    (table) => [
        foreignKey({
            name: "fkBill",
            columns: [table.billId],
            foreignColumns: [bills.id],
        }).onDelete("cascade"),
        foreignKey({
            name: "fkProduct",
            columns: [table.productId],
            foreignColumns: [products.id],
        }).onDelete("restrict"),
        foreignKey({
            name: "fkService",
            columns: [table.serviceId],
            foreignColumns: [services.id],
        }).onDelete("restrict"),
    ]
);
