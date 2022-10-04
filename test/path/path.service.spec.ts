import { Test, TestingModule } from "@nestjs/testing";

import { ArangoDBService } from "src/arangodb/arangodb.service";
import { PathService } from "src/path/path.service";
import { arangoDBServiceMock } from "test/mocks/arangodb.service.mock";

describe("PathService", () => {
	let service: PathService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PathService, { provide: ArangoDBService, useValue: arangoDBServiceMock }],
		}).compile();

		service = module.get<PathService>(PathService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should group paths correctly", () => {
		const result = service.groupPathsByStartPerson(
			[
				{ from: "Garry", to: "Ron" },
				{ from: "Garry", to: "Ron" },
				{ from: "Ron", to: "Tomas" },
			],
			"Garry"
		);

		expect(result).toEqual([["Ron"], ["Ron", "Tomas"]]);
	});

	it("should parse paths and get shortest correctly", () => {
		const result = service.parseRawPaths(
			[
				{
					from: "Hermione",
					to: "Garry",
				},
				{
					from: "Hermione",
					to: "Garry",
				},
				{
					from: "Garry",
					to: "Tomas",
				},
			],
			"Hermione"
		);

		expect(result).toEqual({ from: "Hermione", path: ["Garry"] });
	});

	it("should return empty paths array on empty raw paths", () => {
		const result = service.parseRawPaths([], "Hermione");

		expect(result).toEqual({ from: "Hermione", path: [] });
	});
});
