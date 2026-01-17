"use client";

import { Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export function SignUpForm() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const clearImage = () => {
		setImage(null);
		setImagePreview(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== passwordConfirmation) {
			toast.error("Passwords do not match");
			return;
		}

		await signUp.email({
			email,
			password,
			name: `${firstName} ${lastName}`,
			image: image ? await convertImageToBase64(image) : "",
			callbackURL: "/",
			fetchOptions: {
				onRequest: () => setLoading(true),
				onResponse: () => setLoading(false),
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};

	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<h1 className="font-semibold text-2xl tracking-tight">
						Create an account
					</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						Enter your details to get started
					</p>
				</div>

				<form onSubmit={handleSubmit} className="grid gap-4">
					<div className="grid grid-cols-2 gap-3">
						<div className="grid gap-2">
							<Label htmlFor="first-name">First name</Label>
							<Input
								id="first-name"
								placeholder="John"
								required
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								autoComplete="given-name"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">Last name</Label>
							<Input
								id="last-name"
								placeholder="Doe"
								required
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								autoComplete="family-name"
							/>
						</div>
					</div>

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
							autoComplete="new-password"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="password-confirm">Confirm password</Label>
						<Input
							id="password-confirm"
							type="password"
							placeholder="••••••••"
							required
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="image">
							Profile photo{" "}
							<span className="text-muted-foreground">(optional)</span>
						</Label>
						<div className="flex items-center gap-3">
							{imagePreview ? (
								<div className="relative">
									<div className="relative size-12 overflow-hidden rounded-full">
										<Image
											src={imagePreview}
											alt="Profile preview"
											fill
											className="object-cover"
										/>
									</div>
									<button
										type="button"
										onClick={clearImage}
										className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
									>
										<X size={12} />
									</button>
								</div>
							) : (
								<div className="flex size-12 items-center justify-center rounded-full bg-muted">
									<span className="text-muted-foreground text-xs">Photo</span>
								</div>
							)}
							<Input
								id="image"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="flex-1"
							/>
						</div>
					</div>

					<Button type="submit" className="mt-2 w-full" disabled={loading}>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Create account"
						)}
					</Button>
				</form>

				<p className="mt-6 text-center text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link
						href="/sign-in"
						className="font-medium text-foreground hover:underline"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
