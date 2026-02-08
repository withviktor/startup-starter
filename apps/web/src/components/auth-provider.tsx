"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSession, useActiveOrganization, useListOrganizations, authClient } from "@/lib/auth-client";

type User = {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	emailVerified: boolean;
};

type Organization = {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
	createdAt: Date;
};

type Member = {
	id: string;
	organizationId: string;
	userId: string;
	role: "owner" | "admin" | "member";
	createdAt: Date;
};

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	needsOnboarding: boolean;
	activeOrganization: Organization | null;
	organizations: Organization[];
	currentMember: Member | null;
	switchOrganization: (orgId: string) => Promise<void>;
	isOrgLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

function checkNeedsOnboarding(user: User | null, hasOrganization: boolean): boolean {
	if (!user) return false;
	if (!user.name || user.name.trim() === "") return true;
	if (user.name === user.email) return true;
	if (user.name === user.email.split("@")[0]) return true;
	if (!hasOrganization) return true;
	return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data: session, isPending } = useSession();
	const { data: activeOrgData, isPending: isActiveOrgPending } = useActiveOrganization();
	const { data: orgListData, isPending: isOrgListPending } = useListOrganizations();

	const user = session?.user as User | null;
	const isAuthenticated = !!user;

	const activeOrganization = (activeOrgData as unknown as Organization) ?? null;
	const organizations = (orgListData as unknown as Organization[]) ?? [];
	const currentMember = (activeOrgData as unknown as { activeMember?: Member })?.activeMember ?? null;

	const isOrgLoading = isActiveOrgPending || isOrgListPending;
	const hasOrganization = organizations.length > 0;
	const needsOnboarding = checkNeedsOnboarding(user, hasOrganization);

	const switchOrganization = async (orgId: string) => {
		await authClient.organization.setActive({ organizationId: orgId });
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading: isPending || (isAuthenticated && isOrgLoading),
				isAuthenticated,
				needsOnboarding,
				activeOrganization,
				organizations,
				currentMember,
				switchOrganization,
				isOrgLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
