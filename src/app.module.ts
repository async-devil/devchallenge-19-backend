import { Module } from "@nestjs/common";

import { MessagesModule } from "./messages/messages.module";
import { PathModule } from "./path/path.module";
import { PeopleModule } from "./people/people.module";
import { TrustConnectionsModule } from "./trust-connections/trust-connections.module";

@Module({
	imports: [PeopleModule, TrustConnectionsModule, MessagesModule, PathModule],
})
export class AppModule {}
