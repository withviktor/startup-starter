import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_SERVER_URL: z.string(),
		NEXT_PUBLIC_BETTER_AUTH_BASE_PATH: z.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
		NEXT_PUBLIC_BETTER_AUTH_BASE_PATH: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_PATH,
	}
});
