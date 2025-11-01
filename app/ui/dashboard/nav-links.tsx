"use client";

import { DocumentDuplicateIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
        { name: "Home", href: "/dashboard", icon: HomeIcon },
        {
                name: "Customers",
                href: "/dashboard/customers",
                icon: UserGroupIcon,
        },
        {
                name: "Invoices",
                href: "/dashboard/invoices",
                icon: DocumentDuplicateIcon,
        },
];

export default function NavLinks() {
	const pathname = usePathname();

	return (
		<>
			{links.map((link) => {
				const LinkIcon = link.icon;
				return (
					<Link
						key={link.name}
						href={link.href}
						className={clsx(
							"flex h-12 grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 md:flex-none md:justify-start md:p-2 md:px-3",
							{
								"bg-sky-100 text-blue-600 dark:bg-blue-600 dark:text-white": pathname === link.href,
							},
						)}
					>
						<LinkIcon className="w-6" />
						<p className="hidden md:block">{link.name}</p>
					</Link>
				);
			})}
		</>
	);
}
