"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "light" || savedTheme === "dark") {
			setTheme(savedTheme);
			document.documentElement.classList.toggle("dark", savedTheme === "dark");
		}
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	if (!mounted) {
		return (
			<div className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium dark:bg-gray-800 md:flex-none md:justify-start md:p-2 md:px-3">
				<div className="w-6" />
				<div className="hidden md:block" />
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 md:flex-none md:justify-start md:p-2 md:px-3"
			aria-label="Toggle dark mode"
		>
			{theme === "light" ? (
				<MoonIcon className="w-6" />
			) : (
				<SunIcon className="w-6" />
			)}
			<div className="hidden md:block">
				{theme === "light" ? "Dark Mode" : "Light Mode"}
			</div>
		</button>
	);
}
