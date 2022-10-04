import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnprocessableEntityException,
} from "@nestjs/common";

import { ArangoDBService } from "src/arangodb/arangodb.service";

import { CreatePersonDto } from "./dtos/create-person.dto";
import { UpdatePersonTopicsDto } from "./dtos/update-person-topics.dto";

@Injectable()
export class PeopleService {
	constructor(private readonly arangoDBService: ArangoDBService) {}

	public async createPerson(dto: CreatePersonDto) {
		try {
			await this.arangoDBService.people.save({
				topics: dto.topics,
				_key: dto.id,
			});

			return dto;
		} catch (err) {
			const error = err as Error;

			if (error.message.includes("unique constraint violated"))
				throw new UnprocessableEntityException("Duplicate person");

			throw new InternalServerErrorException(error.message);
		}
	}

	public async updatePersonTopics(key: string, dto: UpdatePersonTopicsDto) {
		try {
			const person = await this.arangoDBService.people.update(
				{ _key: key },
				{ topics: dto.topics },
				{ returnNew: true }
			);

			return {
				id: person._key,
				topics: person.new.topics,
			};
		} catch (err) {
			const error = err as Error;

			if (error.message.includes("document not found"))
				throw new NotFoundException("Person not found");

			throw new InternalServerErrorException(error.message);
		}
	}

	public async getPerson(key: string) {
		try {
			const person = await this.arangoDBService.people.vertex({ _key: key });

			return {
				id: person._key,
				topics: person.topics,
			};
		} catch (err) {
			const error = err as Error;

			if (error.message.includes("document not found"))
				throw new NotFoundException("Person not found");

			throw new InternalServerErrorException(error.message);
		}
	}
}
