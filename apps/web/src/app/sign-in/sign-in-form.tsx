"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export function SignInForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn.email(
			{ email, password },
			{
				onRequest: () => setLoading(true),
				onResponse: () => setLoading(false),
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
				onSuccess: () => {
					router.push("/");
					toast.success("Welcome back!");
				},
			},
		);
	};

	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<h1 className="font-semibold text-2xl tracking-tight">
						Welcome back
					</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						Enter your credentials to access your account
					</p>
				</div>

				<form onSubmit={handleSubmit} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
						/>
					</div>

					<div className="flex items-center gap-2">
						<Checkbox
							id="remember"
							checked={rememberMe}
							onCheckedChange={(checked) => setRememberMe(checked === true)}
						/>
						<Label htmlFor="remember" className="font-normal text-sm">
							Remember me
						</Label>
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Sign in"
						)}
					</Button>
				</form>

				<p className="mt-6 text-center text-muted-foreground text-sm">
					Don&apos;t have an account?{" "}
					<Link
						href="/sign-up"
						className="font-medium text-foreground hover:underline"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
