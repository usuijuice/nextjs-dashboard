"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/app/db";
import { invoices } from "@/app/db/schema";

const FormSchema = z.object({
	id: z.string({ error: "Please select a customer." }),
	customerId: z.string(),
	amount: z.coerce
		.number()
		.gt(0, { message: "Please enter an amount greater than $0." }),
	status: z.enum(["pending", "paid"], {
		error: "Please select an invoice status.",
	}),
	date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
	errors?: {
		customerId?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};

export async function createInvoice(_prevState: State, formData: FormData) {
	const validatedFields = CreateInvoice.safeParse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Create Invoice.",
		};
	}

	const { customerId, amount, status } = validatedFields.data;
	const amountInCents = amount * 100;
	const date = new Date().toISOString().split("T")[0];

	try {
		await db.insert(invoices).values({
			customerId,
			amount: amountInCents,
			status,
			date,
		});
	} catch (error) {
		// We'll also log the error to the console for now
		console.error(error);
		return {
			message: "Database Error: Failed to Create Invoice.",
		};
	}

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/invoices");
	revalidatePath("/dashboard/customers");
	redirect("/dashboard/invoices");
}

export async function updateInvoice(
	id: string,
	_prevState: State,
	formData: FormData,
) {
	const validatedFields = UpdateInvoice.safeParse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Update Invoice.",
		};
	}

	const { customerId, amount, status } = validatedFields.data;
	const amountInCents = amount * 100;

	try {
		await db
			.update(invoices)
			.set({
				customerId,
				amount: amountInCents,
				status,
			})
			.where(eq(invoices.id, id));
	} catch (error) {
		// We'll also log the error to the console for now
		console.error(error);
		return { message: "Database Error: Failed to Update Invoice." };
	}

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/invoices");
	revalidatePath("/dashboard/customers");
	redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
	await db.delete(invoices).where(eq(invoices.id, id));

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/invoices");
	revalidatePath("/dashboard/customers");
}
