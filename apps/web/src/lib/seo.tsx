import { config } from "@startup-starter/config";
import type { Metadata } from "next";

type SeoProps = {
	title?: string;
	description?: string;
	keywords?: string[];
	openGraph?: {
		title?: string;
		description?: string;
		images?: string[];
	};
	canonicalUrl?: string;
	noIndex?: boolean;
};

export function getSeoMetadata({
	title,
	description,
	keywords,
	openGraph,
	canonicalUrl,
	noIndex = false,
}: SeoProps = {}): Metadata {
	const seoTitle = title
		? config.seo.titleTemplate.replace("%s", title)
		: config.seo.defaultTitle;

	const seoDescription = description ?? config.seo.defaultDescription;
	const seoKeywords = keywords ?? config.seo.defaultKeywords;

	return {
		title: seoTitle,
		description: seoDescription,
		keywords: seoKeywords,
		authors: [{ name: config.appName }],
		creator: config.appName,
		metadataBase: new URL(`https://${config.domainName}`),
		alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
		robots: noIndex
			? { index: false, follow: false }
			: { index: true, follow: true },
		openGraph: {
			type: "website",
			siteName: config.appName,
			title: openGraph?.title ?? seoTitle,
			description: openGraph?.description ?? seoDescription,
			images: openGraph?.images ?? [config.seo.ogImage],
		},
		twitter: {
			card: "summary_large_image",
			site: config.seo.twitterHandle,
			creator: config.seo.twitterHandle,
			title: openGraph?.title ?? seoTitle,
			description: openGraph?.description ?? seoDescription,
			images: openGraph?.images ?? [config.seo.ogImage],
		},
	};
}

export function getStructuredData(type: "website" | "organization") {
	if (type === "website") {
		return {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: config.appName,
			description: config.appDescription,
			url: `https://${config.domainName}`,
		};
	}

	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: config.appName,
		description: config.appDescription,
		url: `https://${config.domainName}`,
		email: config.resend.supportEmail,
	};
}
