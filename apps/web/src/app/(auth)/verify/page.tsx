"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const token = searchParams.get("token");
		const callbackURL = searchParams.get("callbackURL") || "/dashboard";

		if (!token) {
			setStatus("error");
			setError("Invalid magic link. No token provided.");
			return;
		}

		async function verifyToken() {
			try {
				const result = await authClient.magicLink.verify({
					query: {
						token: token!,
						callbackURL,
					},
				});

				if (result.error) {
					setStatus("error");
					setError(result.error.message || "Failed to verify magic link");
					return;
				}

				setStatus("success");
				// Redirect after short delay to show success
				setTimeout(() => {
					// Force reload to get fresh session
					window.location.href = callbackURL;
				}, 1000);
			} catch (err) {
				console.error("Verification error:", err);
				setStatus("error");
				setError("Failed to verify magic link. It may have expired.");
			}
		}

		verifyToken();
	}, [searchParams, router]);

	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						{status === "loading" && (
							<Loader2 className="h-6 w-6 animate-spin text-primary" />
						)}
						{status === "success" && (
							<CheckCircle className="h-6 w-6 text-green-600" />
						)}
						{status === "error" && (
							<XCircle className="h-6 w-6 text-destructive" />
						)}
					</div>
					<CardTitle>
						{status === "loading" && "Verifying..."}
						{status === "success" && "Welcome!"}
						{status === "error" && "Verification Failed"}
					</CardTitle>
					<CardDescription>
						{status === "loading" &&
							"Please wait while we verify your magic link"}
						{status === "success" && "You have been signed in successfully"}
						{status === "error" && error}
					</CardDescription>
				</CardHeader>
				{status === "error" && (
					<CardContent className="text-center">
						<Button onClick={() => router.push("/")} variant="outline">
							Back to Sign In
						</Button>
					</CardContent>
				)}
				{status === "success" && (
					<CardContent className="text-center">
						<p className="text-sm text-muted-foreground">
							Redirecting you to the dashboard...
						</p>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
