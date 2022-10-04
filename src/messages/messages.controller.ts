import { BadRequestException, Body, Controller, Post } from "@nestjs/common";

import { CreateMessageDto } from "./dtos/create-message.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Post("/")
	public async createMessage(@Body() dto: CreateMessageDto) {
		if (typeof dto.topics !== "object") {
			throw new BadRequestException("Invalid topics array");
		}

		if (typeof dto.from_person_id !== "string") {
			throw new BadRequestException("Invalid person id");
		}

		if (
			dto.min_trust_level < 0 ||
			dto.min_trust_level > 10 ||
			typeof dto.min_trust_level !== "number" ||
			isNaN(dto.min_trust_level)
		) {
			throw new BadRequestException("Invalid trust level");
		}

		const rawRoutes = await this.messagesService.getRawFilteredRoutes(
			dto.from_person_id,
			dto.topics,
			dto.min_trust_level
		);

		return this.messagesService.parseRawRoutes(rawRoutes, dto.from_person_id);
	}
}
