import { Injectable, OnModuleInit } from "@nestjs/common";
import { config } from "@startup-starter/config";
import { ResendService } from "nestjs-resend";
import { setSendMagicLinkEmail } from "./auth";

@Injectable()
export class MagicLinkEmailProvider implements OnModuleInit {
	constructor(private readonly resendService: ResendService) {}

	onModuleInit() {
		setSendMagicLinkEmail(async ({ email, url }) => {
			await this.resendService.send({
				from: config.resend.fromNoreply,
				to: email,
				subject: `Sign in to ${config.appName}`,
				html: `
					<h2>Sign in to ${config.appName}</h2>
					<p>Click the link below to sign in to your account:</p>
					<a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px;">Sign In</a>
					<p style="margin-top: 16px; color: #666;">If you didn't request this email, you can safely ignore it.</p>
				`,
			});
		});
	}
}
