"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";
import { canManageMembers } from "@/lib/permissions";
import { Loader2, Plus, MoreHorizontal, Shield, Crown, User, Mail, Trash2 } from "lucide-react";

type MemberData = {
	id: string;
	userId: string;
	role: "owner" | "admin" | "member";
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
	};
};

type InvitationData = {
	id: string;
	email: string;
	role: "admin" | "member";
	status: "pending" | "accepted" | "rejected" | "canceled";
	expiresAt: string;
};

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
	owner: "default",
	admin: "secondary",
	member: "outline",
};

const roleIcon: Record<string, typeof Crown> = {
	owner: Crown,
	admin: Shield,
	member: User,
};

export default function MembersPage() {
	const { activeOrganization, currentMember } = useAuth();
	const [members, setMembers] = useState<MemberData[]>([]);
	const [invitations, setInvitations] = useState<InvitationData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [inviteOpen, setInviteOpen] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
	const [isInviting, setIsInviting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isManagerRole = canManageMembers(currentMember?.role);

	useEffect(() => {
		if (activeOrganization?.id) {
			loadMembers();
		}
	}, [activeOrganization?.id]);

	async function loadMembers() {
		setIsLoading(true);
		try {
			const memberRes = await authClient.organization.listMembers({
				query: { organizationId: activeOrganization!.id },
			});
			const memberData = memberRes.data as unknown as { members: MemberData[] } | null;
			setMembers(memberData?.members ?? []);

			if (isManagerRole) {
				const inviteRes = await authClient.organization.listInvitations({
					query: { organizationId: activeOrganization!.id },
				});
				setInvitations(
					((inviteRes.data as unknown as InvitationData[]) ?? []).filter(
						(inv) => inv.status === "pending"
					)
				);
			}
		} catch (err) {
			console.error("Failed to load members:", err);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleInvite(e: React.FormEvent) {
		e.preventDefault();
		if (!inviteEmail.trim()) return;

		setIsInviting(true);
		setError(null);

		try {
			await authClient.organization.inviteMember({
				organizationId: activeOrganization!.id,
				email: inviteEmail.trim(),
				role: inviteRole,
			});
			setInviteEmail("");
			setInviteOpen(false);
			loadMembers();
		} catch (err) {
			console.error("Failed to invite member:", err);
			setError("Failed to send invitation. Please try again.");
		} finally {
			setIsInviting(false);
		}
	}

	async function handleRoleChange(memberId: string, newRole: "admin" | "member") {
		try {
			await authClient.organization.updateMemberRole({
				organizationId: activeOrganization!.id,
				memberId,
				role: newRole,
			});
			loadMembers();
		} catch (err) {
			console.error("Failed to update role:", err);
		}
	}

	async function handleRemoveMember(memberId: string) {
		try {
			await authClient.organization.removeMember({
				organizationId: activeOrganization!.id,
				memberIdOrEmail: memberId,
			});
			loadMembers();
		} catch (err) {
			console.error("Failed to remove member:", err);
		}
	}

	async function handleCancelInvitation(invitationId: string) {
		try {
			await authClient.organization.cancelInvitation({
				invitationId,
			});
			loadMembers();
		} catch (err) {
			console.error("Failed to cancel invitation:", err);
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Members</h2>
					<p className="text-muted-foreground">
						Manage your organization's team members
					</p>
				</div>
				{isManagerRole && (
					<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Invite member
							</Button>
						</DialogTrigger>
						<DialogContent>
							<form onSubmit={handleInvite}>
								<DialogHeader>
									<DialogTitle>Invite a team member</DialogTitle>
									<DialogDescription>
										Send an invitation email to add someone to your organization.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium">
											Email address
										</label>
										<Input
											id="email"
											type="email"
											placeholder="colleague@example.com"
											value={inviteEmail}
											onChange={(e) => setInviteEmail(e.target.value)}
											disabled={isInviting}
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="role" className="text-sm font-medium">
											Role
										</label>
										<Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "admin" | "member")}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="member">Member</SelectItem>
												<SelectItem value="admin">Admin</SelectItem>
											</SelectContent>
										</Select>
									</div>
									{error && <p className="text-sm text-destructive">{error}</p>}
								</div>
								<DialogFooter>
									<Button type="submit" disabled={isInviting}>
										{isInviting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Sending...
											</>
										) : (
											"Send invitation"
										)}
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Team members</CardTitle>
					<CardDescription>
						{members.length} member{members.length !== 1 ? "s" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{members.map((member) => {
							const RoleIcon = roleIcon[member.role] || User;
							return (
								<div
									key={member.id}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
											<RoleIcon className="h-4 w-4" />
										</div>
										<div>
											<p className="text-sm font-medium">
												{member.user.name || member.user.email}
											</p>
											<p className="text-xs text-muted-foreground">
												{member.user.email}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant={roleBadgeVariant[member.role]}>
											{member.role}
										</Badge>
										{isManagerRole && member.role !== "owner" && (
											<div className="flex items-center gap-1">
												<Select
													value={member.role}
													onValueChange={(v) => handleRoleChange(member.id, v as "admin" | "member")}
												>
													<SelectTrigger className="h-8 w-24">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="member">Member</SelectItem>
														<SelectItem value="admin">Admin</SelectItem>
													</SelectContent>
												</Select>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleRemoveMember(member.id)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{isManagerRole && invitations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Pending invitations</CardTitle>
						<CardDescription>
							{invitations.length} pending invitation{invitations.length !== 1 ? "s" : ""}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{invitations.map((invitation) => (
								<div
									key={invitation.id}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
											<Mail className="h-4 w-4" />
										</div>
										<div>
											<p className="text-sm font-medium">{invitation.email}</p>
											<p className="text-xs text-muted-foreground">
												Invited as {invitation.role}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline">Pending</Badge>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleCancelInvitation(invitation.id)}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
