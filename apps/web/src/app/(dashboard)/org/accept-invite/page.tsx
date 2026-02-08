"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2, Building2, Check, X } from "lucide-react";

type InvitationInfo = {
	id: string;
	organizationName: string;
	inviterEmail: string;
	role: string;
};

export default function AcceptInvitePage() {
	const searchParams = useSearchParams();
	const invitationId = searchParams.get("invitationId");
	const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAccepting, setIsAccepting] = useState(false);
	const [isDeclining, setIsDeclining] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [accepted, setAccepted] = useState(false);

	useEffect(() => {
		if (invitationId) {
			loadInvitation();
		} else {
			setIsLoading(false);
			setError("No invitation ID provided.");
		}
	}, [invitationId]);

	async function loadInvitation() {
		try {
			const res = await authClient.organization.getInvitation({
				query: { id: invitationId! },
			});
			if (res.data) {
				setInvitation(res.data as unknown as InvitationInfo);
			} else {
				setError("Invitation not found or has expired.");
			}
		} catch (err) {
			console.error("Failed to load invitation:", err);
			setError("Failed to load invitation. It may have expired.");
		} finally {
			setIsLoading(false);
		}
	}

	async function handleAccept() {
		if (!invitationId) return;

		setIsAccepting(true);
		setError(null);

		try {
			await authClient.organization.acceptInvitation({
				invitationId,
			});
			setAccepted(true);
			setTimeout(() => {
				window.location.href = "/dashboard";
			}, 1500);
		} catch (err) {
			console.error("Failed to accept invitation:", err);
			setError("Failed to accept invitation. Please try again.");
			setIsAccepting(false);
		}
	}

	async function handleDecline() {
		if (!invitationId) return;

		setIsDeclining(true);
		setError(null);

		try {
			await authClient.organization.rejectInvitation({
				invitationId,
			});
			window.location.href = "/dashboard";
		} catch (err) {
			console.error("Failed to decline invitation:", err);
			setError("Failed to decline invitation. Please try again.");
			setIsDeclining(false);
		}
	}

	if (isLoading) {
		return (
			<div className="flex min-h-svh items-center justify-center p-4">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (accepted) {
		return (
			<div className="flex min-h-svh items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<Check className="h-6 w-6 text-green-600" />
						</div>
						<CardTitle>Welcome to the team!</CardTitle>
						<CardDescription>
							Redirecting to dashboard...
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Building2 className="h-6 w-6 text-primary" />
					</div>
					<CardTitle>Organization Invitation</CardTitle>
					{invitation ? (
						<CardDescription>
							You've been invited to join{" "}
							<strong>{invitation.organizationName}</strong> as a{" "}
							<strong>{invitation.role}</strong>
						</CardDescription>
					) : (
						<CardDescription>
							{error || "Loading invitation details..."}
						</CardDescription>
					)}
				</CardHeader>
				{invitation && (
					<CardContent className="space-y-4">
						<div className="rounded-lg border p-3 text-sm space-y-1">
							<p>
								<span className="text-muted-foreground">Organization:</span>{" "}
								{invitation.organizationName}
							</p>
							<p>
								<span className="text-muted-foreground">Invited by:</span>{" "}
								{invitation.inviterEmail}
							</p>
							<p>
								<span className="text-muted-foreground">Role:</span>{" "}
								{invitation.role}
							</p>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<div className="flex gap-3">
							<Button
								className="flex-1"
								onClick={handleAccept}
								disabled={isAccepting || isDeclining}
							>
								{isAccepting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Check className="mr-2 h-4 w-4" />
								)}
								Accept
							</Button>
							<Button
								variant="outline"
								className="flex-1"
								onClick={handleDecline}
								disabled={isAccepting || isDeclining}
							>
								{isDeclining ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<X className="mr-2 h-4 w-4" />
								)}
								Decline
							</Button>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
