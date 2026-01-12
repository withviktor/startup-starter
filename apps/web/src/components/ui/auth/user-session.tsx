"use client";

import { LogOutIcon, ServerCrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Skeleton } from "../skeleton";

export default function UserSession() {
	const { data: session, isPending, error } = useSession();

	useEffect(() => {
		if (error) {
			toast.error("Something went wrong.", {
				description: "We were unable to load your session.",
			});
		}
	}, [error]);

	return !isPending ? (
		session ? (
			!error ? (
				<ButtonGroup>
					<ButtonGroup>
						<Button variant="ghost" size="icon-lg">
							<Avatar>
								<AvatarImage
									src={session.user.image || ""}
									alt={session.user.name}
								/>
								<AvatarFallback className="text-white">
									{session.user.name[0]}
								</AvatarFallback>
							</Avatar>
						</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button variant="ghost" size="icon-lg" onClick={() => signOut().finally(() => toast.success("You have successfully signed out."))}>
							<LogOutIcon />
						</Button>
					</ButtonGroup>
				</ButtonGroup>
			) : (
				<div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-destructive text-sm text-white">
					<ServerCrashIcon />
				</div>
			)
		) : (
			<ButtonGroup>
				<ButtonGroup>
					<Button variant="default" aria-label="Sign In" asChild>
						<Link href="/sign-in">Sign In</Link>
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<Button variant="default" aria-label="Sign Up" asChild>
						<Link href="/sign-up">Sign Up</Link>
					</Button>
				</ButtonGroup>
			</ButtonGroup>
		)
	) : (
		<Skeleton className="h-10 w-50" />
	);
}
