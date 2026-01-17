import { stripe } from "@better-auth/stripe";
import { config } from "@startup-starter/config";
import { env } from "@startup-starter/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import Stripe from "stripe";
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

// Create Stripe client if enabled
const stripePlugin = config.stripe.enabled
	? (() => {
			if (!env.STRIPE_SECRET_KEY) {
				throw new Error("Stripe is enabled but STRIPE_SECRET_KEY is missing");
			}
			const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
				apiVersion: "2025-12-15.clover",
			});
			return stripe({
				stripeClient,
				stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET || "",
				createCustomerOnSignUp: true,
				subscription: {
					enabled: true,
					plans: config.stripe.plans
						.filter((plan) => plan.priceId)
						.map((plan) => ({
							name: plan.name,
							priceId: plan.priceId,
						})),
				},
			});
		})()
	: null;

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
		...(stripePlugin ? [stripePlugin] : []),
	],
	hooks: {},
	trustedOrigins: [env.CORS_ORIGIN],
});
