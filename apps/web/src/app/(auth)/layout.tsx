"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { isLoading, isAuthenticated, needsOnboarding } = useAuth();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			// Redirect authenticated users to dashboard or onboarding
			if (needsOnboarding) {
				router.replace("/onboarding");
			} else {
				router.replace("/dashboard");
			}
		}
	}, [isLoading, isAuthenticated, needsOnboarding, router]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	// Show auth pages only if not authenticated
	if (isAuthenticated) {
		return <LoadingScreen />;
	}

	return <>{children}</>;
}
