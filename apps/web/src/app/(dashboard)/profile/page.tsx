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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";
import { Loader2, Save, Check } from "lucide-react";

export default function ProfilePage() {
	const { user } = useAuth();
	const [name, setName] = useState(user?.name || "");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) {
			setError("Please enter your name");
			return;
		}

		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await authClient.updateUser({
				name: name.trim(),
			});
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (err) {
			console.error("Failed to update profile:", err);
			setError("Failed to update profile. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	const getInitials = (name?: string | null, email?: string | null) => {
		if (name) {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		if (email) {
			return email[0].toUpperCase();
		}
		return "U";
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Profile</h2>
				<p className="text-muted-foreground">
					Manage your account settings and profile information
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>Update your profile details here</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16">
								<AvatarImage src={user?.image || undefined} />
								<AvatarFallback className="text-lg">
									{getInitials(user?.name, user?.email)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">{user?.name || "User"}</p>
								<p className="text-sm text-muted-foreground">{user?.email}</p>
							</div>
						</div>

						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Display name
							</label>
							<Input
								id="name"
								type="text"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email
							</label>
							<Input
								id="email"
								type="email"
								value={user?.email || ""}
								disabled
								className="bg-muted"
							/>
							<p className="text-xs text-muted-foreground">
								Email cannot be changed
							</p>
						</div>

						{error && <p className="text-sm text-destructive">{error}</p>}
						{success && (
							<p className="flex items-center gap-2 text-sm text-green-600">
								<Check className="h-4 w-4" />
								Profile updated successfully
							</p>
						)}

						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save changes
								</>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
