import SideNav from "@/app/ui/dashboard/sidenav";

export default function DemoPage() {
	return (
		<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
			<div className="w-full flex-none md:w-64">
				<SideNav />
			</div>
			<div className="grow p-6 md:overflow-y-auto md:p-12">
				<div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
					<h1 className="mb-4 text-3xl font-bold">Dark Mode Demo</h1>
					<p className="text-gray-700 dark:text-gray-300">
						This is a demo page to showcase the dark mode toggle functionality.
						Click the dark mode button in the sidebar to toggle between light
						and dark modes.
					</p>
					<div className="mt-6 space-y-4">
						<div className="rounded-lg bg-white p-4 shadow dark:bg-gray-700">
							<h2 className="text-xl font-semibold">Card Example</h2>
							<p className="mt-2 text-gray-600 dark:text-gray-400">
								This card will change colors when you toggle dark mode.
							</p>
						</div>
						<div className="rounded-lg bg-white p-4 shadow dark:bg-gray-700">
							<h2 className="text-xl font-semibold">Another Card</h2>
							<p className="mt-2 text-gray-600 dark:text-gray-400">
								Notice how all elements adapt to the selected theme.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
