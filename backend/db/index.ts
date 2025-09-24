import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";

export const db = drizzle({
    connection: {
        url: process.env.POSTGRES_URL,
        ssl: true,
        prepare: false,
    },
    schema,
});
