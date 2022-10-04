import { BadRequestException, Body, Controller, Post } from "@nestjs/common";

import { GetPathDto } from "./dtos/get-path.dto";
import { PathService } from "./path.service";

@Controller("path")
export class PathController {
	constructor(private readonly pathService: PathService) {}

	@Post("/")
	public async getPath(@Body() dto: GetPathDto) {
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

		const rawPaths = await this.pathService.getRawPaths(
			dto.from_person_id,
			dto.topics,
			dto.min_trust_level
		);

		return this.pathService.parseRawPaths(rawPaths, dto.from_person_id);
	}
}
