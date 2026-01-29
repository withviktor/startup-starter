import type { Config } from "./types";

export type * from "./types";

export const config: Config = {
	// General
	appName: "StartupStarter",
	appDescription:
		"Your startup starter kit for building modern web applications",
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

	// Polar
	polar: {
		featuredPlanIndex: 1,
		plans: [
			{
				name: "Free",
				description: "Perfect for getting started",
				price: 0,
				productId: "d09050f0-031c-4c47-84f2-b8e10804a77e",
				slug: "free",
				features: ["Feature 1", "Feature 2"],
			},
			{
				name: "Pro",
				description: "For growing businesses",
				price: 15.99,
				originalPrice: 29.99,
				productId: "d8aadf95-2d66-4a48-886c-b1b3674c2a77",
				slug: "pro",
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
		defaultDescription:
			"Your startup starter kit for building modern web applications",
		defaultKeywords: ["startup", "nextjs", "react", "typescript"],
		twitterHandle: "@yourtwitterhandle",
		ogImage: "/og-image.png",
	},
};
