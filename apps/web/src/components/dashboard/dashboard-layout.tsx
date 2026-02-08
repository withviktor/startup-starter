"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	User,
	Settings,
	LogOut,
	Users,
	Building2,
	ChevronsUpDown,
	Plus,
	Check,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/auth-provider";
import { config } from "@startup-starter/config";
import { canManageMembers } from "@/lib/permissions";
import { useState, useRef, useEffect } from "react";

type NavItem = {
	title: string;
	href: string;
	icon: typeof Home;
	visible?: boolean;
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { user, activeOrganization, organizations, currentMember, switchOrganization } = useAuth();
	const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOrgDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const navItems: NavItem[] = [
		{ title: "Dashboard", href: "/dashboard", icon: Home, visible: true },
		{ title: "Members", href: "/org/members", icon: Users, visible: canManageMembers(currentMember?.role) },
		{ title: "Profile", href: "/profile", icon: User, visible: true },
		{ title: "Settings", href: "/settings", icon: Settings, visible: true },
	];

	const handleSignOut = async () => {
		await authClient.signOut();
	};

	const getInitials = (name?: string | null, email?: string | null) => {
		if (name) {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		if (email) {
			return email[0].toUpperCase();
		}
		return "U";
	};

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<Link href="/">
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
										<span className="font-bold text-sm">
											{config.appName[0]}
										</span>
									</div>
									<div className="flex flex-col gap-0.5 leading-none">
										<span className="font-semibold">{config.appName}</span>
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
					{/* Org Switcher */}
					<div className="relative" ref={dropdownRef}>
						<button
							type="button"
							onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
							className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
						>
							<Building2 className="size-4 shrink-0 text-muted-foreground" />
							<span className="flex-1 truncate text-left">
								{activeOrganization?.name || "Select organization"}
							</span>
							<ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
						</button>
						{orgDropdownOpen && (
							<div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-popover p-1 shadow-md">
								{organizations.map((org) => (
									<button
										key={org.id}
										type="button"
										onClick={() => {
											switchOrganization(org.id);
											setOrgDropdownOpen(false);
										}}
										className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
									>
										<span className="flex-1 truncate text-left">{org.name}</span>
										{activeOrganization?.id === org.id && (
											<Check className="size-4 text-primary" />
										)}
									</button>
								))}
								<Separator className="my-1" />
								<Link
									href="/onboarding"
									onClick={() => setOrgDropdownOpen(false)}
									className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
								>
									<Plus className="size-4" />
									<span>Create organization</span>
								</Link>
							</div>
						)}
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems
									.filter((item) => item.visible !== false)
									.map((item) => (
										<SidebarMenuItem key={item.href}>
											<SidebarMenuButton
												asChild
												isActive={pathname === item.href}
											>
												<Link href={item.href as "/"}>
													<item.icon className="size-4" />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="cursor-default">
								<Avatar className="size-8">
									<AvatarImage src={user?.image || undefined} />
									<AvatarFallback>
										{getInitials(user?.name, user?.email)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-medium text-sm truncate">
										{user?.name || "User"}
									</span>
									<span className="text-xs text-muted-foreground truncate">
										{user?.email}
									</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={handleSignOut}>
								<LogOut className="size-4" />
								<span>Sign out</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-14 items-center gap-4 border-b px-4">
					<SidebarTrigger />
					<Separator orientation="vertical" className="h-6" />
					<h1 className="font-semibold">
						{navItems.find((item) => item.href === pathname)?.title ||
							"Dashboard"}
					</h1>
				</header>
				<main className="flex-1 overflow-auto p-4">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
