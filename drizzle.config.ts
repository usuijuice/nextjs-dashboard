import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./app/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.POSTGRES_URL_NON_POOLING ?? "",
	},
});
