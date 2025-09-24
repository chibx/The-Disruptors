import { foreignKey, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./business";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        email: varchar("email", { length: 255 }).unique().notNull(),
        phone: varchar("phone", { length: 50 }),
        password: text("password_hash").notNull(),
        role: varchar("role", { length: 50 }).notNull(), // Owner, Accountant, etc.
        businessId: integer("business_id").notNull(),
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

// User Activity Logs Table
export const userActivityLogs = pgTable(
    "user_activity_logs",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id").notNull(),
        action: varchar("action", { length: 255 }).notNull(),
        details: jsonb("details"),
        timestamp: timestamp("timestamp").defaultNow().notNull(),
    },
    (table) => [
        foreignKey({
            name: "fkUser",
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete("cascade"),
    ]
);

// Audit Trails Table
export const auditTrails = pgTable(
    "audit_trails",
    {
        id: serial("id").primaryKey(),
        tableName: varchar("table_name", { length: 255 }).notNull(),
        recordId: integer("record_id").notNull(),
        action: varchar("action", { length: 50 }).notNull(), // create, update, delete
        oldData: jsonb("old_data"),
        newData: jsonb("new_data"),
        userId: integer("user_id").notNull(),
        timestamp: timestamp("timestamp").defaultNow().notNull(),
    },
    (table) => [
        foreignKey({
            name: "fkUser",
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete("restrict"),
    ]
);
