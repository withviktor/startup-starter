import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { ResendModule } from "nestjs-resend";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SignUpHook } from "./hooks/sign-up.hook";
import { auth } from "./lib/auth";
import { PrismaProvider } from "./prisma.service";

@Module({
	imports: [
		AuthModule.forRoot({
			auth,
		}),
		ResendModule.forRoot({
			apiKey: process.env.RESEND_API_KEY,
		}),
	],
	controllers: [AppController],
	providers: [AppService, PrismaProvider, SignUpHook],
	exports: [PrismaProvider],
})
export class AppModule {}
