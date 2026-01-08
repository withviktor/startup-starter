import { env } from "@startup-starter/env/server";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: env.DATABASE_URL,
	},
});
