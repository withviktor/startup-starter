import { Injectable } from "@nestjs/common";
import {
    AfterHook,
    type AuthHookContext,
    Hook,
} from "@thallesp/nestjs-better-auth";
import { ResendService } from 'nestjs-resend';

@Hook()
@Injectable()
export class SignUpHook {
    constructor(private readonly resendService: ResendService) { }

    @AfterHook("/sign-up/email")
    async handle(ctx: AuthHookContext) {
        await this.resendService.send({
            from: 'Linemark Starter <hello@startup.bylinemark.com>',
            to: ctx.body?.email,
            subject: 'Welcome to Linemark Starter!',
            html: '<strong>It works!</strong>',
        });
    }
}
