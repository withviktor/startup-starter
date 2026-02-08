import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground">
					Manage your application settings
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
					<CardDescription>
						Configure your application preferences
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Settings coming soon...
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
