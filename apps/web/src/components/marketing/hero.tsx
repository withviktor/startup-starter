"use client";

import { config } from "@startup-starter/config";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

export function Hero() {
	const { data: session } = useSession();
	const [isLoading, setIsLoading] = useState(false);

	const handleGetStarted = async () => {
		// If Stripe is not enabled or no paid plan, just redirect to sign-up
		if (!config.stripe.enabled) {
			window.location.href = "/sign-up";
			return;
		}

		// Find the featured plan or first paid plan
		const plan =
			config.stripe.plans[config.stripe.featuredPlanIndex] ||
			config.stripe.plans.find((p) => p.price > 0);

		if (!plan?.priceId) {
			window.location.href = "/sign-up";
			return;
		}

		// If not signed in, redirect to sign-up
		if (!session) {
			window.location.href = "/sign-up";
			return;
		}

		setIsLoading(true);

		try {
			// @ts-expect-error - Stripe plugin methods are dynamically added
			const result = await authClient.subscription.upgrade({
				plan: plan.name,
				successUrl: `${window.location.origin}/dashboard?success=true`,
				cancelUrl: `${window.location.origin}/?canceled=true`,
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to start checkout");
			} else if (result.data?.url) {
				window.location.href = result.data.url;
			}
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="py-24 md:py-32 lg:py-40">
			<div className="mx-auto max-w-4xl px-4 text-center">
				<h1 className="font-extrabold text-4xl tracking-tight md:text-5xl lg:text-6xl">
					Ship your startup
					<br />
					<span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
						in days, not months
					</span>
				</h1>

				<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
					The Next.js boilerplate with authentication, payments, and beautiful
					UI — all configured and ready to go.
				</p>

				<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Button
						size="lg"
						className="h-12 gap-2 rounded-full px-8 font-semibold text-base"
						disabled={isLoading}
						onClick={handleGetStarted}
					>
						{isLoading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<ArrowRight className="size-4" />
						)}
						Get {config.appName}
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="h-12 rounded-full px-8 font-semibold text-base"
						asChild
					>
						<Link
							href="https://github.com/withviktor/startup-starter"
							target="_blank"
							rel="noopener noreferrer"
						>
							View on GitHub
						</Link>
					</Button>
				</div>

				<p className="mt-6 text-muted-foreground text-sm">
					Free and open source. No credit card required.
				</p>
			</div>
		</section>
	);
}
