"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DashboardRouteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const { isLoading, isAuthenticated, needsOnboarding } = useAuth();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				// Redirect unauthenticated users to login
				router.replace("/");
			} else if (needsOnboarding && pathname !== "/onboarding" && pathname !== "/org/accept-invite") {
				// Redirect users who need onboarding (except if already on onboarding or accept-invite page)
				router.replace("/onboarding");
			}
		}
	}, [isLoading, isAuthenticated, needsOnboarding, pathname, router]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (!isAuthenticated) {
		return <LoadingScreen />;
	}

	// Don't wrap onboarding or accept-invite pages in dashboard layout
	if (pathname === "/onboarding" || pathname === "/org/accept-invite") {
		return <>{children}</>;
	}

	// Redirect to onboarding if needed
	if (needsOnboarding) {
		return <LoadingScreen />;
	}

	return <DashboardLayout>{children}</DashboardLayout>;
}
