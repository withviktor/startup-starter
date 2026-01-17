import type { Config } from "./types.js";

export type * from "./types.js";

export const config: Config = {
	// General
	appName: "StartupStarter",
	appDescription: "Your startup starter kit for building modern web applications",
	domainName: "example.com",

	// Auth (better-auth)
	auth: {
		emailPassword: true,
		magicLink: false,
		providers: {
			google: false,
			github: false,
		},
	},

	// Stripe
	stripe: {
		enabled: false,
		featuredPlanIndex: 1,
		plans: [
			{
				name: "Free",
				description: "Perfect for getting started",
				price: 0,
				priceId: "",
				features: ["Feature 1", "Feature 2"],
			},
			{
				name: "Pro",
				description: "For growing businesses",
				price: 15.99,
				originalPrice: 29.99,
				priceId: "",
				features: ["Everything in Free", "Feature 3", "Feature 4"],
			},
		],
	},

	// Resend (Email)
	resend: {
		fromNoreply: "noreply@example.com",
		fromAdmin: "admin@example.com",
		supportEmail: "support@example.com",
	},

	// SEO defaults
	seo: {
		defaultTitle: "StartupStarter",
		titleTemplate: "%s | StartupStarter",
		defaultDescription: "Your startup starter kit for building modern web applications",
		defaultKeywords: ["startup", "nextjs", "react", "typescript"],
		twitterHandle: "@yourtwitterhandle",
		ogImage: "/og-image.png",
	},
};
