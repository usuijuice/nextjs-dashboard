import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
	throw new Error("POSTGRES_URL_NON_POOLING is not set");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle({ client, schema });
