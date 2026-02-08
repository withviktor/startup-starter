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
import { authClient } from "@/lib/auth-client";
import { config } from "@startup-starter/config";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export function MagicLinkForm() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const result = await authClient.signIn.magicLink({
				email,
				callbackURL: "/",
			});
			console.log("[MagicLinkForm] Result:", result);
			if (result.error) {
				setError(result.error.message || "Failed to send magic link");
			} else {
				setIsSent(true);
			}
		} catch (err) {
			console.error("[MagicLinkForm] Error:", err);
			setError("Failed to send magic link. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	if (isSent) {
		return (
			<div className="flex min-h-svh items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<CheckCircle className="h-6 w-6 text-primary" />
						</div>
						<CardTitle>Check your email</CardTitle>
						<CardDescription>
							We sent a magic link to <strong>{email}</strong>
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-sm text-muted-foreground">
							Click the link in your email to sign in. If you don't see it,
							check your spam folder.
						</p>
						<Button
							variant="ghost"
							className="mt-4"
							onClick={() => {
								setIsSent(false);
								setEmail("");
							}}
						>
							Use a different email
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<CardTitle>Welcome to {config.appName}</CardTitle>
					<CardDescription>
						Enter your email to sign in or create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Input
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>
						{error && (
							<p className="text-sm text-destructive">{error}</p>
						)}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								"Continue with Email"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
