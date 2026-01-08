import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	@ApiResponse({
		status: 200,
		description: 'Responds with a string',
		type: String,
	})
	@AllowAnonymous()
	getHello(): string {
		return this.appService.getHello();
	}
}
