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
import { magicLink, openAPI, organization } from "better-auth/plugins";
import prisma from "./prisma";

// Email sender function - will be set by NestJS module
let sendMagicLinkEmail: ((params: { email: string; url: string }) => Promise<void>) | null = null;

export function setSendMagicLinkEmail(fn: (params: { email: string; url: string }) => Promise<void>) {
	sendMagicLinkEmail = fn;
}

// Org invite email sender - will be set by NestJS module
let sendOrgInviteEmail: ((params: { email: string; orgName: string; inviterName: string; acceptUrl: string }) => Promise<void>) | null = null;

export function setSendOrgInviteEmail(fn: (params: { email: string; orgName: string; inviterName: string; acceptUrl: string }) => Promise<void>) {
	sendOrgInviteEmail = fn;
}

// Convert backend magic link URL to frontend verification URL
function convertToFrontendUrl(backendUrl: string): string {
	const url = new URL(backendUrl);
	const token = url.searchParams.get("token");
	const callbackURL = url.searchParams.get("callbackURL") || "/";

	// Build frontend verification URL
	const frontendUrl = new URL("/verify", env.CORS_ORIGIN);
	if (token) frontendUrl.searchParams.set("token", token);
	frontendUrl.searchParams.set("callbackURL", callbackURL);

	return frontendUrl.toString();
}

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
		enabled: config.auth.emailPassword && !config.auth.magicLink,
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
		...(config.auth.magicLink
			? [
					magicLink({
						expiresIn: 60 * 10, // 10 minutes
						sendMagicLink: async ({ email, url }) => {
							if (sendMagicLinkEmail) {
								try {
									// Convert to frontend URL so verification happens on frontend
									const frontendUrl = convertToFrontendUrl(url);
									await sendMagicLinkEmail({ email, url: frontendUrl });
								} catch (error) {
									throw new Error(`Failed to send magic link email: ${error}`);
								}
							} else {
								throw new Error("Email sender not configured");
							}
						},
					}),
				]
			: []),
		organization({
			sendInvitationEmail: async ({ email, organization: org, inviter }) => {
				if (sendOrgInviteEmail) {
					const acceptUrl = new URL("/org/accept-invite", env.CORS_ORIGIN);
					await sendOrgInviteEmail({
						email,
						orgName: org.name,
						inviterName: inviter.user.name || inviter.user.email,
						acceptUrl: acceptUrl.toString(),
					});
				} else {
					throw new Error("Org invite email sender not configured");
				}
			},
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
