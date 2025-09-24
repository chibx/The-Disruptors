import { date, decimal, foreignKey, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./business";
import { customers } from "./customers";
import { products } from "./products";
import { services } from "./services";

// Invoices Table
export const invoices = pgTable(
    "invoices",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        invoiceNumber: varchar("invoice_number", { length: 100 }).unique().notNull(),
        date: date("date").notNull(),
        dueDate: date("due_date").notNull(),
        customerId: integer("customer_id").notNull(),
        totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
        taxes: decimal("taxes", { precision: 10, scale: 2 }).default("0.00"),
        paymentStatus: varchar("payment_status", { length: 50 }).default("unpaid"), // unpaid, partial, paid
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

// Invoice Items Table (supports both products and services)
export const invoiceItems = pgTable(
    "invoice_items",
    {
        id: serial("id").primaryKey(),
        invoiceId: integer("invoice_id").notNull(),
        itemType: varchar("item_type", { length: 50 }).notNull(), // product or service
        productId: integer("product_id"),
        serviceId: integer("service_id"),
        quantity: integer("quantity").default(1),
        price: decimal("price", { precision: 10, scale: 2 }).notNull(),
        total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    },
    (table) => [
        foreignKey({
            name: "fkInvoice",
            columns: [table.invoiceId],
            foreignColumns: [invoices.id],
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
