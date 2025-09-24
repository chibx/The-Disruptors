import { relations } from "drizzle-orm";
import { date, decimal, foreignKey, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { settings } from "..";
import { customers } from "./customers";
import { creditNotes, debitNotes, expenseReceipts, generalLedger, salesReceipts, taxRecords } from "./documents";
import { invoices } from "./invoices";
import { bankAccounts, cashAccounts } from "./monetary/accounts";
import { bills } from "./monetary/bills";
import { chartOfAccounts, fixedAssets, loans } from "./monetary/others";
import { paymentsMade, paymentsReceived } from "./monetary/payments";
import { products } from "./products";
import { services } from "./services";
import { suppliers } from "./suppliers";
import { users } from "./users";

// Businesses Table
export const businesses = pgTable("businesses", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }), // e.g., Sole Proprietorship, LLC
    industry: varchar("industry", { length: 100 }),
    address: text("address"),
    contactPhone: varchar("contact_phone", { length: 50 }),
    contactEmail: varchar("contact_email", { length: 255 }),
    taxId: varchar("tax_id", { length: 50 }), // EIN, VAT, etc.
    fiscalYearStart: date("fiscal_year_start"),
    currency: varchar("currency", { length: 3 }).default("USD"), // ISO code
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Employees Table (for Payroll)
export const employees = pgTable(
    "employees",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        address: text("address"),
        salaryRate: decimal("salary_rate", { precision: 10, scale: 2 }), // or wage rate
        taxDetails: jsonb("tax_details"), // JSON for flexibility, e.g., withholding rates
        bankAccount: varchar("bank_account", { length: 100 }), // for direct deposit
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

// Payroll History Table
export const payrollHistory = pgTable(
    "payroll_history",
    {
        id: serial("id").primaryKey(),
        employeeId: integer("employee_id").notNull(),
        payDate: date("pay_date").notNull(),
        grossPay: decimal("gross_pay", { precision: 10, scale: 2 }).notNull(),
        taxesWithheld: decimal("taxes_withheld", { precision: 10, scale: 2 }),
        otherDeductions: decimal("other_deductions", { precision: 10, scale: 2 }),
        netPay: decimal("net_pay", { precision: 10, scale: 2 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkEmployee",
            columns: [table.employeeId],
            foreignColumns: [employees.id],
        }).onDelete("cascade"),
    ]
);

// Timesheets Table
export const timesheets = pgTable(
    "timesheets",
    {
        id: serial("id").primaryKey(),
        employeeId: integer("employee_id").notNull(),
        startDate: date("start_date").notNull(),
        endDate: date("end_date").notNull(),
        hoursWorked: decimal("hours_worked", { precision: 5, scale: 2 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fkEmployee",
            columns: [table.employeeId],
            foreignColumns: [employees.id],
        }).onDelete("cascade"),
    ]
);

// Documents Table (for receipts, bills, etc.)
export const documents = pgTable(
    "documents",
    {
        id: serial("id").primaryKey(),
        businessId: integer("business_id").notNull(),
        fileName: varchar("file_name", { length: 255 }).notNull(),
        filePath: text("file_path").notNull(), // URL or path to storage
        referenceId: integer("reference_id"),
        referenceType: varchar("reference_type", { length: 50 }), // invoice, bill, etc.
        uploadedBy: integer("uploaded_by").notNull(),
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
            name: "fkUser",
            columns: [table.uploadedBy],
            foreignColumns: [users.id],
        }).onDelete("restrict"),
    ]
);

// Relations (optional, for Drizzle queries)
export const businessesRelations = relations(businesses, ({ many }) => ({
    users: many(users),
    customers: many(customers),
    suppliers: many(suppliers),
    products: many(products),
    services: many(services),
    invoices: many(invoices),
    salesReceipts: many(salesReceipts),
    creditNotes: many(creditNotes),
    paymentsReceived: many(paymentsReceived),
    bills: many(bills),
    expenseReceipts: many(expenseReceipts),
    debitNotes: many(debitNotes),
    paymentsMade: many(paymentsMade),
    bankAccounts: many(bankAccounts),
    cashAccounts: many(cashAccounts),
    employees: many(employees),
    fixedAssets: many(fixedAssets),
    loans: many(loans),
    chartOfAccounts: many(chartOfAccounts),
    generalLedger: many(generalLedger),
    taxRecords: many(taxRecords),
    documents: many(documents),
    settings: many(settings), // Actually one-to-one, but many for flexibility
}));
