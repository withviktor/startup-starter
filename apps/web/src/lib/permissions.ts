type OrgRole = "owner" | "admin" | "member" | undefined | null;

export function canManageMembers(role: OrgRole): boolean {
	return role === "owner" || role === "admin";
}

export function canEditOrg(role: OrgRole): boolean {
	return role === "owner" || role === "admin";
}

export function canDeleteOrg(role: OrgRole): boolean {
	return role === "owner";
}
