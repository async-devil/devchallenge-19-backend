import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";

import { SetTrustConnectionsDto } from "./dtos/set-trust-connections.dto";
import { TrustConnectionsService } from "./trust-connections.service";

@Controller()
export class TrustConnectionsController {
	constructor(private readonly trustConnectionsService: TrustConnectionsService) {}

	@Post("/people/:key/trust_connections")
	public async createTrustConnections(
		@Param("key") key: string,
		@Body() dto: SetTrustConnectionsDto
	) {
		if (typeof key !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		return await this.trustConnectionsService.setTrustConnections(key, dto);
	}

	@Get("/people/:from_key/trust_connections/:to_key")
	public async getTrustConnection(@Param("from_key") from: string, @Param("to_key") to: string) {
		if (typeof from !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		if (typeof to !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		return await this.trustConnectionsService.getTrustConnection(from, to);
	}
}
