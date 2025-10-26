import { asc, count, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/app/db";
import { customers, invoices, revenue } from "@/app/db/schema";
import type { InvoiceForm } from "./definitions";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
	try {
		return await db.select().from(revenue);
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch revenue data.");
	}
}

export async function fetchLatestInvoices() {
	try {
		const data = await db
			.select({
				id: invoices.id,
				amount: invoices.amount,
				name: customers.name,
				image_url: customers.imageUrl,
				email: customers.email,
			})
			.from(invoices)
			.innerJoin(customers, eq(invoices.customerId, customers.id))
			.orderBy(desc(invoices.date))
			.limit(5);

		const latestInvoices = data.map((invoice) => ({
			...invoice,
			amount: formatCurrency(invoice.amount),
		}));
		return latestInvoices;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch the latest invoices.");
	}
}

export async function fetchCardData() {
	try {
		const invoiceCountPromise = db.select({ count: count() }).from(invoices);
		const customerCountPromise = db.select({ count: count() }).from(customers);
		const invoicesTotalsPromise = db
			.select({ amount: invoices.amount, status: invoices.status })
			.from(invoices);

		const [invoiceCountRows, customerCountRows, invoiceTotalsRows] =
			await Promise.all([
				invoiceCountPromise,
				customerCountPromise,
				invoicesTotalsPromise,
			]);

		const numberOfInvoices = Number(invoiceCountRows[0]?.count ?? 0);
		const numberOfCustomers = Number(customerCountRows[0]?.count ?? 0);

		const totals = invoiceTotalsRows.reduce(
			(acc, invoice) => {
				if (invoice.status === "paid") {
					acc.paid += invoice.amount;
				} else if (invoice.status === "pending") {
					acc.pending += invoice.amount;
				}
				return acc;
			},
			{ paid: 0, pending: 0 },
		);

		const totalPaidInvoices = formatCurrency(totals.paid);
		const totalPendingInvoices = formatCurrency(totals.pending);

		return {
			numberOfCustomers,
			numberOfInvoices,
			totalPaidInvoices,
			totalPendingInvoices,
		};
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch card data.");
	}
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
	query: string,
	currentPage: number,
) {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;
	try {
		return await db
			.select({
				id: invoices.id,
				customer_id: invoices.customerId,
				amount: invoices.amount,
				date: invoices.date,
				status: invoices.status,
				name: customers.name,
				email: customers.email,
				image_url: customers.imageUrl,
			})
			.from(invoices)
			.innerJoin(customers, eq(invoices.customerId, customers.id))
			.where(
				or(
					like(customers.name, `%${query}%`),
					like(customers.email, `%${query}%`),
					like(invoices.status, `%${query}%`),
				),
			)
			.orderBy(desc(invoices.date))
			.limit(ITEMS_PER_PAGE)
			.offset(offset);
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch invoices.");
	}
}

export async function fetchInvoicesPages(query: string) {
	try {
		const data = await db
			.select({ count: count() })
			.from(invoices)
			.innerJoin(customers, eq(invoices.customerId, customers.id))
			.where(
				or(
					like(customers.name, `%${query}%`),
					like(customers.email, `%${query}%`),
					like(invoices.status, `%${query}%`),
				),
			);

		const totalPages = Math.ceil(Number(data[0]?.count ?? 0) / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch total number of invoices.");
	}
}

export async function fetchInvoiceById(id: string) {
	try {
		const data = await db
			.select({
				id: invoices.id,
				customer_id: invoices.customerId,
				amount: invoices.amount,
				status: invoices.status,
			})
			.from(invoices)
			.where(eq(invoices.id, id));

		const invoice = data.map((invoice) => ({
			...invoice,
			amount: invoice.amount / 100,
			status: invoice.status as InvoiceForm["status"],
		}));

		return invoice[0];
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch invoice.");
	}
}

export async function fetchCustomers() {
	try {
		return await db
			.select({
				id: customers.id,
				name: customers.name,
			})
			.from(customers)
			.orderBy(asc(customers.name));
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch all customers.");
	}
}
