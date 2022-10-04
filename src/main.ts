import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	app.setGlobalPrefix("api");

	await app.listen(8080, "0.0.0.0");
	Logger.log("Server started on http://localhost:8080", "NestApplication");
}

void bootstrap();
