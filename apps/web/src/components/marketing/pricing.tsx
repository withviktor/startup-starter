"use client";

import { config } from "@startup-starter/config";
import { Check, Loader2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function Pricing() {
	const { plans, featuredPlanIndex } = config.polar;
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

	const handleSubscribe = async (productId: string, slug: string) => {

		if (!productId) {
			toast.error("Subscriptions are not configured");
			return;
		}

		setLoadingPlan(slug);

		try {
			await authClient.checkoutEmbed({
				slug: slug,
			});
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setLoadingPlan(null);
		}
	};

	return (
		<section id="pricing" className="relative py-24">
			{/* Background */}
			<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-muted/30 to-background" />

			<div className="relative mx-auto max-w-5xl px-4">
				<div className="mb-16 text-center">
					<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm">
						<Sparkles className="size-4 text-amber-500" />
						<span className="font-medium text-amber-600 dark:text-amber-400">
							Limited time offer
						</span>
					</div>
					<h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
						Simple,{" "}
						<span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
							transparent
						</span>{" "}
						pricing
					</h2>
					<p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
						No recurring fees. Pay once, own it forever.
					</p>
				</div>

				<div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
					{plans.map((plan, index) => {
						const isFeatured = index === featuredPlanIndex;
						const isLoading = loadingPlan === plan.slug;
						const hasDiscount =
							plan.originalPrice && plan.originalPrice > plan.price;

						return (
							<div
								key={plan.name}
								className={cn(
									"relative flex flex-col rounded-3xl p-8 transition-colors duration-300",
									isFeatured
										? "border-2 border-primary bg-linear-to-b from-primary/5 to-primary/10"
										: "border border-border bg-card hover:border-primary/30",
								)}
							>
								{isFeatured && (
									<div className="absolute -top-4 right-0 left-0 mx-auto w-fit">
										<span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 font-semibold text-primary-foreground text-sm">
											<Zap className="size-4" />
											MOST POPULAR
										</span>
									</div>
								)}

								<div className="mb-6">
									<h3 className="font-bold text-xl">{plan.name}</h3>
									<p className="mt-2 text-muted-foreground text-sm">
										{plan.description}
									</p>
								</div>

								<div className="mb-8">
									{hasDiscount && (
										<div className="mb-2 flex items-center gap-2">
											<span className="text-2xl text-muted-foreground line-through">
												${plan.originalPrice}
											</span>
											<span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-600 text-xs dark:text-emerald-400">
												SAVE ${(plan.originalPrice! - plan.price).toFixed(0)}
											</span>
										</div>
									)}
									<div className="flex items-baseline gap-1">
										<span className="font-extrabold text-5xl tracking-tight">
											${plan.price}
										</span>
										<span className="text-muted-foreground text-sm">USD</span>
									</div>
								</div>

								<ul className="mb-8 flex-1 space-y-3">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-3 text-sm"
										>
											<div
												className={cn(
													"mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
													isFeatured ? "bg-primary/20" : "bg-emerald-500/10",
												)}
											>
												<Check
													className={cn(
														"size-3",
														isFeatured
															? "text-primary"
															: "text-emerald-600 dark:text-emerald-400",
													)}
												/>
											</div>
											<span className="text-foreground">{feature}</span>
										</li>
									))}
								</ul>

								<div className="mt-auto space-y-3">
									<Button
										className={cn(
											"h-12 w-full rounded-xl font-semibold text-base transition-colors",
											isFeatured && "bg-primary hover:bg-primary/90",
										)}
										size="lg"
										disabled={isLoading || !plan.productId}
										onClick={() => handleSubscribe(plan.productId, plan.slug)}
									>
										{isLoading ? (
											<Loader2 className="size-5 animate-spin" />
										) : (
											<>
												<Sparkles className="mr-2 size-4" />
												{plan.price === 0
													? "Get started free"
													: `Get ${config.appName}`}
											</>
										)}
									</Button>

									<p className="text-center text-muted-foreground text-xs">
										{plan.price === 0
											? "No credit card required"
											: "Pay once. Build unlimited projects!"}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-12 text-center">
					<p className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
						<span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10">
							<Check className="size-3 text-emerald-600 dark:text-emerald-400" />
						</span>
						30-day money-back guarantee. No questions asked.
					</p>
				</div>
			</div>
		</section>
	);
}
