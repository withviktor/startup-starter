import { NestFactory } from "@nestjs/core";
import { env } from "@startup-starter/env/server";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});
	await app.listen(env.PORT);
}
bootstrap();
