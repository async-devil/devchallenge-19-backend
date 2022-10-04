import { Body, Controller, Post, Put, Param, Get, BadRequestException } from "@nestjs/common";

import { CreatePersonDto } from "./dtos/create-person.dto";
import { UpdatePersonTopicsDto } from "./dtos/update-person-topics.dto";
import { PeopleService } from "./people.service";

@Controller("people")
export class PeopleController {
	constructor(private readonly peopleService: PeopleService) {}

	@Post("/")
	public async createPerson(@Body() dto: CreatePersonDto) {
		if (typeof dto.topics !== "object") {
			throw new BadRequestException("Invalid topics array");
		}

		if (typeof dto.id !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		return await this.peopleService.createPerson(dto);
	}

	@Put("/:key")
	public async updatePersonTopics(@Param("key") key: string, @Body() dto: UpdatePersonTopicsDto) {
		if (typeof dto.topics !== "object") {
			throw new BadRequestException("Invalid topics array");
		}

		if (typeof key !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		return await this.peopleService.updatePersonTopics(key, dto);
	}

	@Get("/:key")
	public async getPerson(@Param("key") key: string) {
		if (typeof key !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		return await this.peopleService.getPerson(key);
	}
}
