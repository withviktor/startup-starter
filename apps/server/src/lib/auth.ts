import {
	checkout,
	polar,
	portal
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { config } from "@startup-starter/config";
import { env } from "@startup-starter/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import prisma from "./prisma";

// Build social providers based on config
type SocialProvider = {
	id: string;
	name: string;
	clientId: string;
	clientSecret: string;
};
const socialProviders: SocialProvider[] = [];

if (config.auth.providers.google) {
	if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
		throw new Error(
			"Google OAuth is enabled but GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing",
		);
	}
	socialProviders.push({
		id: "google",
		name: "Google",
		clientId: env.GOOGLE_CLIENT_ID,
		clientSecret: env.GOOGLE_CLIENT_SECRET,
	});
}

if (config.auth.providers.github) {
	if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
		throw new Error(
			"GitHub OAuth is enabled but GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing",
		);
	}
	socialProviders.push({
		id: "github",
		name: "GitHub",
		clientId: env.GITHUB_CLIENT_ID,
		clientSecret: env.GITHUB_CLIENT_SECRET,
	});
}
// Create Polar client
const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	// Use 'sandbox' if you're using the Polar Sandbox environment
	// Remember that access tokens, products, etc. are completely separated between environments.
	// Access tokens obtained in Production are for instance not usable in the Sandbox environment.
	server: "sandbox",
});

export const auth = betterAuth({
	basePath: env.BETTER_AUTH_BASE_PATH,
	baseUrl: env.BETTER_AUTH_URL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: config.auth.emailPassword,
	},
	socialProviders:
		socialProviders.length > 0
			? socialProviders.reduce(
				(acc, provider) => {
					acc[provider.id] = {
						clientId: provider.clientId,
						clientSecret: provider.clientSecret,
					};
					return acc;
				},
				{} as Record<string, { clientId: string; clientSecret: string }>,
			)
			: undefined,
	plugins: [
		openAPI({
			disableDefaultReference: true,
		}),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					authenticatedUsersOnly: true,
					successUrl: "/dashboard?checkout=success",
					products: (config.polar.plans || []).map((plan) => ({
						productId: plan.productId,
						slug: plan.slug,
					})),
				}),
				portal(),
			],
		})
	],
	hooks: {},
	trustedOrigins: [env.CORS_ORIGIN],
});
