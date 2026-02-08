import { polarClient } from "@polar-sh/better-auth/client";
import { config } from "@startup-starter/config";
import { env } from "@startup-starter/env/web";
import { createAuthClient } from "better-auth/react";
import { magicLinkClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	basePath: env.NEXT_PUBLIC_BETTER_AUTH_BASE_PATH,
	plugins: [
		polarClient(),
		organizationClient(),
		...(config.auth.magicLink ? [magicLinkClient()] : []),
	]
});

// Core auth methods
export const { signIn, signOut, signUp, useSession } = authClient;

// Organization hooks
export const useActiveOrganization = authClient.useActiveOrganization;
export const useListOrganizations = authClient.useListOrganizations;

// Auth config helpers for UI
export const authConfig = {
	emailPassword: config.auth.emailPassword,
	magicLink: config.auth.magicLink,
	providers: config.auth.providers,
	hasOAuthProviders: Object.values(config.auth.providers).some(Boolean),
	polar: config.polar,
} as const;
