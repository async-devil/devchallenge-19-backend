import { Module } from "@nestjs/common";

import { ArangoDBModule } from "src/arangodb/arangodb.module";

import { TrustConnectionsController } from "./trust-connections.controller";
import { TrustConnectionsService } from "./trust-connections.service";

@Module({
	imports: [ArangoDBModule],
	controllers: [TrustConnectionsController],
	providers: [TrustConnectionsService],
})
export class TrustConnectionsModule {}
