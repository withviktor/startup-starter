import { NestFactory } from "@nestjs/core";
import type { OpenAPIObject } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { env } from "@startup-starter/env/server";
import { AppModule } from "./app.module";
import { auth } from "./lib/auth";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});

	const config = new DocumentBuilder()
		.setTitle('API Reference')
		.setDescription('The API Reference description')
		.setVersion('1.0')
		.build()

	const nestDocument = SwaggerModule.createDocument(app, config)
	const authDocument = await auth.api.generateOpenAPISchema() as OpenAPIObject

	const authPaths: OpenAPIObject['paths'] = {}
	for (const [path, operations] of Object.entries(authDocument.paths ?? {})) {
		const prefixedPath = path.startsWith('/auth') ? path : `/auth${path}`
		authPaths[prefixedPath] = {}
		for (const [method, operation] of Object.entries(operations ?? {})) {
			authPaths[prefixedPath][method] = {
				...operation,
				tags: ['Auth'],
			}
		}
	}

	const document: OpenAPIObject = {
		...nestDocument,
		paths: {
			...nestDocument.paths,
			...authPaths,
		},
		components: {
			...nestDocument.components,
			schemas: {
				...nestDocument.components?.schemas,
				...authDocument.components?.schemas,
			},
		},
		tags: [
			...(nestDocument.tags ?? []),
			{ name: 'Auth', description: 'Authentication endpoints' },
		],
	}

	app.use(
		'/reference',
		apiReference({
			content: document,
		}),
	)

	app.enableCors({
		origin: ['http://localhost:3001'],
		credentials: true,
	});

	await app.listen(env.PORT);
}
bootstrap();
