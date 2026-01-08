"use client";
import Link from "next/link";

export default function Home() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<div className="grid gap-6">
				<section className="rounded-lg p-4">
					<h2 className="mb-2 font-medium">Welcome to Startup Starter</h2>
					<Link href="/sign-in">Sign In</Link>
					<Link href="/sign-up">Sign Up</Link>
				</section>
			</div>
		</div>
	);
}
