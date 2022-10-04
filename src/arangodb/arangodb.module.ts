import { Module } from "@nestjs/common";

import { ArangoDBService } from "./arangodb.service";

@Module({
	providers: [ArangoDBService],
	exports: [ArangoDBService],
})
export class ArangoDBModule {}
