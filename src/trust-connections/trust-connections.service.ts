import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { aql } from "arangojs";
import { ArrayCursor } from "arangojs/cursor";

import { ArangoDBService } from "src/arangodb/arangodb.service";
import { TrustConnectionEntity } from "src/arangodb/entities/TrustConnection.schema";

import { SetTrustConnectionsDto } from "./dtos/set-trust-connections.dto";

@Injectable()
export class TrustConnectionsService {
	constructor(private readonly arangoDBService: ArangoDBService) {}

	public async setTrustConnections(key: string, dto: SetTrustConnectionsDto) {
		for (const [destination, level] of Object.entries(dto)) {
			if (typeof destination !== "string") {
				throw new BadRequestException("Invalid person id");
			}

			if (level < 0 || level > 10 || typeof level !== "number" || isNaN(level)) {
				throw new BadRequestException("Invalid trust level");
			}

			try {
				const trustConnection = await this.getTrustConnection(key, destination);

				await this.updateTrustConnection(trustConnection._key, level);
			} catch (err) {
				const error = err as Error;

				if (error.name === NotFoundException.name) {
					await this.createTrustConnection(key, destination, level);
				} else {
					throw new InternalServerErrorException(error.message);
				}
			}
		}
	}

	public async updateTrustConnection(key: string, level: number) {
		try {
			return await this.arangoDBService.trustConnections.update(
				{ _key: key },
				{
					level,
				}
			);
		} catch (err) {
			const error = err as Error;

			throw new InternalServerErrorException(error.message);
		}
	}

	public async createTrustConnection(from: string, to: string, level: number) {
		try {
			return await this.arangoDBService.trustConnections.save({
				_from: `people/${from}`, // accepts only ids
				_to: `people/${to}`,
				level,
			});
		} catch (err) {
			const error = err as Error;

			if (error.message.includes("document not found"))
				throw new NotFoundException("Person not found");

			throw new InternalServerErrorException(error.message);
		}
	}

	public async getTrustConnection(from: string, to: string) {
		const fromId = `people/${from}`; // accepts only ids
		const toId = `people/${to}`;

		const search = (await this.arangoDBService.db.query(
			aql`
      	FOR c in trust_connections
        	FILTER c._from == ${fromId}
        	FILTER c._to == ${toId}
        	RETURN c
    	`,
			{ count: true }
		)) as ArrayCursor<TrustConnectionEntity>;

		if (search.count === 0) throw new NotFoundException("Trust connection not found");

		const result = await search.all();

		return result[0];
	}
}
