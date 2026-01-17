import { Code2, CreditCard, Lock, Palette, Rocket, Zap } from "lucide-react";

const features = [
	{
		icon: Zap,
		title: "Lightning Fast",
		description:
			"Built on Next.js 15 with React 19. Optimized for speed with server components and streaming.",
		color: "text-amber-500",
		bgColor: "bg-amber-500/10",
	},
	{
		icon: Lock,
		title: "Secure Auth",
		description:
			"Better Auth with OAuth providers, magic links, and email/password. Production-ready security.",
		color: "text-emerald-500",
		bgColor: "bg-emerald-500/10",
	},
	{
		icon: CreditCard,
		title: "Stripe Payments",
		description:
			"Subscriptions, one-time payments, and webhooks. Start collecting revenue on day one.",
		color: "text-violet-500",
		bgColor: "bg-violet-500/10",
	},
	{
		icon: Palette,
		title: "Beautiful UI",
		description:
			"Shadcn/ui components with dark mode. Fully customizable and accessible by default.",
		color: "text-pink-500",
		bgColor: "bg-pink-500/10",
	},
	{
		icon: Code2,
		title: "DX First",
		description:
			"TypeScript, ESLint, Prettier, and Biome configured. Monorepo ready with Turborepo.",
		color: "text-sky-500",
		bgColor: "bg-sky-500/10",
	},
	{
		icon: Rocket,
		title: "Deploy Ready",
		description:
			"Works with Vercel, Railway, or any platform. Docker support included.",
		color: "text-orange-500",
		bgColor: "bg-orange-500/10",
	},
];

export function Features() {
	return (
		<section id="features" className="relative py-24">
			{/* Background gradient */}
			<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/50 to-background" />

			<div className="relative mx-auto max-w-5xl px-4">
				<div className="mb-16 text-center">
					<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm">
						<span className="font-medium">Features</span>
					</div>
					<h2 className="font-bold text-3xl tracking-tight md:text-4xl">
						Everything you need to{" "}
						<span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
							ship fast
						</span>
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-muted-foreground">
						Stop wasting weeks on boilerplate. Get authentication, payments, and
						a beautiful UI out of the box.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="group relative rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/50"
						>
							<div
								className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${feature.bgColor}`}
							>
								<feature.icon className={`size-6 ${feature.color}`} />
							</div>
							<h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
