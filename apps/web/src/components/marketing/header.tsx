"use client";

import { config } from "@startup-starter/config";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";

export function Header() {
	const { data: session, isPending } = useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-lg">
			<nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-lg tracking-tight"
				>
					<div className="flex size-8 items-center justify-center rounded-lg bg-primary">
						<Sparkles className="size-4 text-primary-foreground" />
					</div>
					{config.appName}
				</Link>

				{/* Desktop nav */}
				<div className="hidden items-center gap-8 md:flex">
					<Link
						href="#features"
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
					>
						Features
					</Link>
					<Link
						href="#pricing"
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
					>
						Pricing
					</Link>

					{isPending ? (
						<Skeleton className="h-9 w-32 rounded-full bg-muted" />
					) : session ? (
						<div className="flex items-center gap-3">
							<div className="relative">
								<Avatar className="size-8 ring-2 ring-primary/20">
									<AvatarImage
										src={session.user.image || ""}
										alt={session.user.name}
									/>
									<AvatarFallback className="bg-primary/10 text-xs">
										{session.user.name?.[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground"
								onClick={() =>
									signOut().then(() => toast.success("Signed out successfully"))
								}
							>
								<LogOut className="mr-2 size-4" />
								Sign out
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/sign-in">Sign in</Link>
							</Button>
							<Button size="sm" className="rounded-full px-4" asChild>
								<Link href="/sign-up">Get started</Link>
							</Button>
						</div>
					)}
				</div>

				{/* Mobile menu button */}
				<button
					type="button"
					className="rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				>
					{mobileMenuOpen ? (
						<X className="size-5" />
					) : (
						<Menu className="size-5" />
					)}
				</button>
			</nav>

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="border-border/40 border-t px-4 py-4 md:hidden">
					<div className="flex flex-col gap-4">
						<Link
							href="#features"
							className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							onClick={() => setMobileMenuOpen(false)}
						>
							Features
						</Link>
						<Link
							href="#pricing"
							className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							onClick={() => setMobileMenuOpen(false)}
						>
							Pricing
						</Link>
						{session ? (
							<Button
								variant="ghost"
								size="sm"
								className="justify-start"
								onClick={() => {
									signOut().then(() =>
										toast.success("Signed out successfully"),
									);
									setMobileMenuOpen(false);
								}}
							>
								Sign out
							</Button>
						) : (
							<>
								<Button
									variant="ghost"
									size="sm"
									className="justify-start"
									asChild
								>
									<Link
										href="/sign-in"
										onClick={() => setMobileMenuOpen(false)}
									>
										Sign in
									</Link>
								</Button>
								<Button size="sm" className="rounded-full" asChild>
									<Link
										href="/sign-up"
										onClick={() => setMobileMenuOpen(false)}
									>
										Get started
									</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
