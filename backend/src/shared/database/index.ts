import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
}

const client = postgres(databaseUrl);

export const db = drizzle(client, { schema });
export type DatabaseClient = typeof db;

export const migrateDatabase = async () => {
    await migrate(db, {
        migrationsFolder: path.resolve(process.cwd(), "drizzle"),
    });
};

export const closeDatabase = async () => {
    await client.end();
};
