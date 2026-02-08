"use client";

import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import {
	Activity,
	CreditCard,
	Users,
	TrendingUp,
	Check,
	Circle,
	ArrowRight,
} from "lucide-react";

const stats = [
	{
		title: "Total Revenue",
		value: "$0.00",
		description: "Your total revenue this month",
		icon: CreditCard,
	},
	{
		title: "Active Users",
		value: "0",
		description: "Users active in the last 30 days",
		icon: Users,
	},
	{
		title: "Growth",
		value: "0%",
		description: "Compared to last month",
		icon: TrendingUp,
	},
	{
		title: "Activity",
		value: "0",
		description: "Actions taken this week",
		icon: Activity,
	},
];

export function DashboardContent() {
	const { user, activeOrganization } = useAuth();

	const hasCompletedProfile = Boolean(
		user?.name && user.name !== user.email
	);

	const hasOrganization = !!activeOrganization;

	const onboardingSteps = [
		{
			title: "Sign in with magic link",
			completed: true,
		},
		{
			title: "Complete your profile",
			completed: hasCompletedProfile,
			href: "/profile",
		},
		{
			title: "Create or join an organization",
			completed: hasOrganization,
			href: "/onboarding",
		},
		{
			title: "Choose a subscription plan",
			completed: false,
			href: "#",
		},
	];

	const completedSteps = onboardingSteps.filter((s) => s.completed).length;
	const totalSteps = onboardingSteps.length;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					Welcome back{user?.name ? `, ${user.name}` : ""}!
				</h2>
				<p className="text-muted-foreground">
					Here's what's happening with your account today.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">
								{stat.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Getting Started</CardTitle>
						<CardDescription>
							{completedSteps} of {totalSteps} steps completed
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="h-2 w-full rounded-full bg-muted">
							<div
								className="h-2 rounded-full bg-primary transition-all"
								style={{
									width: `${(completedSteps / totalSteps) * 100}%`,
								}}
							/>
						</div>
						<ul className="space-y-3">
							{onboardingSteps.map((step) => (
								<li
									key={step.title}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										{step.completed ? (
											<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
												<Check className="h-3 w-3 text-primary-foreground" />
											</div>
										) : (
											<Circle className="h-5 w-5 text-muted-foreground" />
										)}
										<span
											className={
												step.completed ? "text-muted-foreground" : ""
											}
										>
											{step.title}
										</span>
									</div>
									{!step.completed && step.href && (
										<Button variant="ghost" size="sm" asChild>
											<Link href={step.href as "/"}>
												<ArrowRight className="h-4 w-4" />
											</Link>
										</Button>
									)}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Your latest actions and updates
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							No recent activity to show. Start using the app to see your
							activity here.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
