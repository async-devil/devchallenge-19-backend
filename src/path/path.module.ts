import { Module } from "@nestjs/common";

import { ArangoDBModule } from "src/arangodb/arangodb.module";

import { PathController } from "./path.controller";
import { PathService } from "./path.service";

@Module({
	imports: [ArangoDBModule],
	controllers: [PathController],
	providers: [PathService],
})
export class PathModule {}
