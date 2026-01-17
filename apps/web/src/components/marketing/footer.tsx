import { config } from "@startup-starter/config";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-border/40 border-t bg-muted/30">
			<div className="mx-auto max-w-5xl px-4 py-16">
				<div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
					{/* Brand */}
					<div className="text-center md:text-left">
						<Link
							href="/"
							className="inline-flex items-center gap-2 font-bold text-lg tracking-tight"
						>
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary">
								<Sparkles className="size-4 text-primary-foreground" />
							</div>
							{config.appName}
						</Link>
						<p className="mt-3 max-w-xs text-muted-foreground text-sm">
							{config.appDescription}
						</p>
					</div>

					{/* Links */}
					<div className="flex flex-wrap justify-center gap-8 md:justify-end">
						<div className="space-y-3">
							<h4 className="font-medium text-sm">Product</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>
									<Link
										href="#features"
										className="transition-colors hover:text-foreground"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="#pricing"
										className="transition-colors hover:text-foreground"
									>
										Pricing
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-medium text-sm">Legal</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>
									<Link
										href="#"
										className="transition-colors hover:text-foreground"
									>
										Privacy
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="transition-colors hover:text-foreground"
									>
										Terms
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-medium text-sm">Support</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>
									<Link
										href={`mailto:${config.resend.supportEmail}`}
										className="transition-colors hover:text-foreground"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="https://github.com/withviktor/startup-starter"
										target="_blank"
										rel="noopener noreferrer"
										className="transition-colors hover:text-foreground"
									>
										GitHub
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-border/40 border-t pt-8 md:flex-row">
					<p className="text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} {config.appName}. All rights
						reserved.
					</p>
					<p className="flex items-center gap-1.5 text-muted-foreground text-sm">
						Made with <Heart className="size-4 fill-red-500 text-red-500" /> by
						indie hackers
					</p>
				</div>
			</div>
		</footer>
	);
}
