import { Module } from "@nestjs/common";

import { ArangoDBModule } from "src/arangodb/arangodb.module";

import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";

@Module({
	imports: [ArangoDBModule],
	controllers: [MessagesController],
	providers: [MessagesService],
})
export class MessagesModule {}
