import type { Metadata } from "next";
import { Suspense } from "react";
import CustomersTable from "@/app/ui/customers/table";
export const metadata: Metadata = {
	title: "Customers",
};

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CustomersTable customers={[]} />
		</Suspense>
	);
}
