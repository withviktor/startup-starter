"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";
import { config } from "@startup-starter/config";
import { Loader2, User, ArrowRight, Building2, Users } from "lucide-react";

type Step = 1 | 2;

function StepIndicator({ currentStep }: { currentStep: Step }) {
	return (
		<div className="flex items-center justify-center gap-2 mb-6">
			{[1, 2].map((step) => (
				<div key={step} className="flex items-center gap-2">
					<div
						className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
							step === currentStep
								? "bg-primary text-primary-foreground"
								: step < currentStep
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground"
						}`}
					>
						{step}
					</div>
					{step < 2 && (
						<div
							className={`h-0.5 w-8 ${
								step < currentStep ? "bg-primary" : "bg-muted"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);
}

function ProfileStep({ onComplete }: { onComplete: () => void }) {
	const { user } = useAuth();
	const [name, setName] = useState(user?.name || "");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) {
			setError("Please enter your name");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await authClient.updateUser({ name: name.trim() });
			onComplete();
		} catch (err) {
			console.error("Failed to update profile:", err);
			setError("Failed to update profile. Please try again.");
			setIsLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<User className="h-6 w-6 text-primary" />
				</div>
				<CardTitle>Welcome to {config.appName}!</CardTitle>
				<CardDescription>
					Let's set up your profile to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Your name
						</label>
						<Input
							id="name"
							type="text"
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isLoading}
							autoFocus
						/>
						<p className="text-xs text-muted-foreground">
							This is how you'll appear in the app
						</p>
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								Continue
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

function OrganizationStep() {
	const [tab, setTab] = useState<"create" | "join">("create");
	const [orgName, setOrgName] = useState("");
	const [invitationId, setInvitationId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const slug = orgName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!orgName.trim()) {
			setError("Please enter an organization name");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await authClient.organization.create({
				name: orgName.trim(),
				slug,
			});
			window.location.href = "/dashboard";
		} catch (err) {
			console.error("Failed to create organization:", err);
			setError("Failed to create organization. Please try again.");
			setIsLoading(false);
		}
	}

	async function handleJoin(e: React.FormEvent) {
		e.preventDefault();
		if (!invitationId.trim()) {
			setError("Please enter an invitation ID");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await authClient.organization.acceptInvitation({
				invitationId: invitationId.trim(),
			});
			window.location.href = "/dashboard";
		} catch (err) {
			console.error("Failed to join organization:", err);
			setError("Failed to join organization. Please try again.");
			setIsLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Building2 className="h-6 w-6 text-primary" />
				</div>
				<CardTitle>Set up your organization</CardTitle>
				<CardDescription>
					Create a new organization or join an existing one
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex gap-1 mb-4 rounded-lg bg-muted p-1">
					<button
						type="button"
						onClick={() => { setTab("create"); setError(null); }}
						className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							tab === "create"
								? "bg-background shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						<Building2 className="inline-block mr-1.5 h-4 w-4" />
						Create
					</button>
					<button
						type="button"
						onClick={() => { setTab("join"); setError(null); }}
						className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							tab === "join"
								? "bg-background shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						<Users className="inline-block mr-1.5 h-4 w-4" />
						Join
					</button>
				</div>

				{tab === "create" ? (
					<form onSubmit={handleCreate} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="orgName" className="text-sm font-medium">
								Organization name
							</label>
							<Input
								id="orgName"
								type="text"
								placeholder="Acme Inc."
								value={orgName}
								onChange={(e) => setOrgName(e.target.value)}
								disabled={isLoading}
								autoFocus
							/>
							{slug && (
								<p className="text-xs text-muted-foreground">
									Slug: {slug}
								</p>
							)}
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									Create organization
									<ArrowRight className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>
					</form>
				) : (
					<form onSubmit={handleJoin} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="invitationId" className="text-sm font-medium">
								Invitation ID
							</label>
							<Input
								id="invitationId"
								type="text"
								placeholder="Paste your invitation ID"
								value={invitationId}
								onChange={(e) => setInvitationId(e.target.value)}
								disabled={isLoading}
								autoFocus
							/>
							<p className="text-xs text-muted-foreground">
								Ask your team admin for the invitation ID
							</p>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Joining...
								</>
							) : (
								<>
									Join organization
									<ArrowRight className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>
					</form>
				)}
			</CardContent>
		</Card>
	);
}

export default function OnboardingPage() {
	const { user, organizations } = useAuth();
	const hasName = user?.name && user.name !== user.email && user.name !== user.email?.split("@")[0];
	const hasOrg = organizations.length > 0;

	// Determine initial step
	const [step, setStep] = useState<Step>(hasName ? 2 : 1);

	// If user already completed profile during this session, jump to step 2
	const currentStep = step;

	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-4">
			<StepIndicator currentStep={currentStep} />
			{currentStep === 1 && (
				<ProfileStep onComplete={() => setStep(2)} />
			)}
			{currentStep === 2 && <OrganizationStep />}
		</div>
	);
}
