import { Module } from "@nestjs/common";

import { ArangoDBModule } from "src/arangodb/arangodb.module";

import { PeopleController } from "./people.controller";
import { PeopleService } from "./people.service";

@Module({
	imports: [ArangoDBModule],
	controllers: [PeopleController],
	providers: [PeopleService],
})
export class PeopleModule {}
