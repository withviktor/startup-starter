"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth-provider";
import { authClient } from "@/lib/auth-client";
import { canEditOrg, canDeleteOrg } from "@/lib/permissions";
import { Loader2 } from "lucide-react";

export default function OrgSettingsPage() {
	const { activeOrganization, currentMember } = useAuth();
	const [name, setName] = useState(activeOrganization?.name || "");
	const [slug, setSlug] = useState(activeOrganization?.slug || "");
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState("");

	const isEditor = canEditOrg(currentMember?.role);
	const isOwner = canDeleteOrg(currentMember?.role);

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;

		setIsSaving(true);
		setError(null);
		setSuccess(null);

		try {
			await authClient.organization.update({
				organizationId: activeOrganization!.id,
				data: {
					name: name.trim(),
					slug: slug.trim(),
				},
			});
			setSuccess("Organization updated successfully.");
		} catch (err) {
			console.error("Failed to update organization:", err);
			setError("Failed to update organization. Please try again.");
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete() {
		if (deleteConfirm !== activeOrganization?.name) return;

		setIsDeleting(true);
		setError(null);

		try {
			await authClient.organization.delete({
				organizationId: activeOrganization!.id,
			});
			window.location.href = "/dashboard";
		} catch (err) {
			console.error("Failed to delete organization:", err);
			setError("Failed to delete organization. Please try again.");
			setIsDeleting(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
				<p className="text-muted-foreground">
					Manage your organization settings
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>General</CardTitle>
					<CardDescription>
						Update your organization name and slug
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSave} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="orgName" className="text-sm font-medium">
								Organization name
							</label>
							<Input
								id="orgName"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={!isEditor || isSaving}
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="orgSlug" className="text-sm font-medium">
								Slug
							</label>
							<Input
								id="orgSlug"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								disabled={!isEditor || isSaving}
							/>
							<p className="text-xs text-muted-foreground">
								Used in URLs to identify your organization
							</p>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						{success && <p className="text-sm text-green-600">{success}</p>}
						{isEditor && (
							<Button type="submit" disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save changes"
								)}
							</Button>
						)}
					</form>
				</CardContent>
			</Card>

			{isOwner && (
				<Card className="border-destructive">
					<CardHeader>
						<CardTitle className="text-destructive">Danger zone</CardTitle>
						<CardDescription>
							Permanently delete this organization and all associated data
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							Type <strong>{activeOrganization?.name}</strong> to confirm deletion.
						</p>
						<Input
							value={deleteConfirm}
							onChange={(e) => setDeleteConfirm(e.target.value)}
							placeholder={activeOrganization?.name}
							disabled={isDeleting}
						/>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting || deleteConfirm !== activeOrganization?.name}
						>
							{isDeleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete organization"
							)}
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
