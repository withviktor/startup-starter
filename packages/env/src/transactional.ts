import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
	server: {
		BASE_URL: z.string(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
