export type OAuthProvider = "google" | "github";

export type AuthConfig = {
	/** Enable email + password authentication */
	emailPassword: boolean;
	/** Enable magic link authentication */
	magicLink: boolean;
	/** OAuth providers configuration */
	providers: Record<OAuthProvider, boolean>;
};

export type PolarPlan = {
	/** Plan display name */
	name: string;
	/** Plan description */
	description: string;
	/** Current price in dollars (0 for free) */
	price: number;
	/** Original price before discount (optional, shows strikethrough price) */
	originalPrice?: number;
	/** Polar product ID (e.g., e651f46d-ac20-4f26-b769-ad088b123df2) */
	productId: string;
	/** Polar product slug */
	slug: string;
	/** List of features included in this plan */
	features: string[];
}

export type PolarConfig = {
	/** Index of the featured/recommended plan (0-based) */
	featuredPlanIndex: number;
	/** Available pricing plans */
	plans: PolarPlan[];
}

export type ResendConfig = {
	/** Email address for transactional emails (e.g., noreply@example.com) */
	fromNoreply: string;
	/** Email address for admin communications */
	fromAdmin: string;
	/** Support email address */
	supportEmail: string;
};

export type SeoConfig = {
	/** Default page title when no title is provided */
	defaultTitle: string;
	/** Title template - %s will be replaced with page title */
	titleTemplate: string;
	/** Default meta description */
	defaultDescription: string;
	/** Default meta keywords */
	defaultKeywords: string[];
	/** Twitter/X handle (e.g., @yourtwitterhandle) */
	twitterHandle: string;
	/** Default Open Graph image path */
	ogImage: string;
};

export type Config = {
	/** Application name */
	appName: string;
	/** Application description */
	appDescription: string;
	/** Primary domain name (without https://) */
	domainName: string;
	/** Authentication configuration */
	auth: AuthConfig;
	/** Polar payments configuration */
	polar: PolarConfig;
	/** Resend email configuration */
	resend: ResendConfig;
	/** SEO defaults configuration */
	seo: SeoConfig;
};
