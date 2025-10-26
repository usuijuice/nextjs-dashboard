import type { Metadata } from "next";
import Image from "next/image";
import { fetchCustomersList } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
        title: "Customers",
};

export default async function Page() {
        const customers = await fetchCustomersList();

        return (
                <div className="w-full">
                        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
                        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                                <tr>
                                                        <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                                                        >
                                                                Customer
                                                        </th>
                                                        <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                                                        >
                                                                Email
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                                {customers.length === 0 ? (
                                                        <tr>
                                                                <td
                                                                        className="px-6 py-10 text-center text-sm text-gray-500"
                                                                        colSpan={2}
                                                                >
                                                                        No customers found.
                                                                </td>
                                                        </tr>
                                                ) : (
                                                        customers.map((customer) => (
                                                                <tr key={customer.id}>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                                                <div className="flex items-center gap-3">
                                                                                        <Image
                                                                                                src={customer.image_url}
                                                                                                alt={`${customer.name}'s profile picture`}
                                                                                                className="h-10 w-10 rounded-full"
                                                                                                width={40}
                                                                                                height={40}
                                                                                        />
                                                                                        <span className="font-semibold">
                                                                                                {customer.name}
                                                                                        </span>
                                                                                </div>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                                {customer.email}
                                                                        </td>
                                                                </tr>
                                                        ))
                                                )}
                                        </tbody>
                                </table>
                        </div>
                </div>
        );
}
