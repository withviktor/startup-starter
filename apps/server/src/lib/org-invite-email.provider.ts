import { Injectable, OnModuleInit } from "@nestjs/common";
import { config } from "@startup-starter/config";
import { ResendService } from "nestjs-resend";
import { setSendOrgInviteEmail } from "./auth";

@Injectable()
export class OrgInviteEmailProvider implements OnModuleInit {
	constructor(private readonly resendService: ResendService) {}

	onModuleInit() {
		setSendOrgInviteEmail(async ({ email, orgName, inviterName, acceptUrl }) => {
			await this.resendService.send({
				from: config.resend.fromNoreply,
				to: email,
				subject: `You've been invited to ${orgName}`,
				html: `
					<h2>You've been invited to ${orgName}</h2>
					<p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong>.</p>
					<a href="${acceptUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
					<p style="margin-top: 16px; color: #666;">If you didn't expect this invitation, you can safely ignore this email.</p>
				`,
			});
		});
	}
}
