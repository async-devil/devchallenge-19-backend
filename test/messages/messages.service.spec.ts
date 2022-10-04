import { Test, TestingModule } from "@nestjs/testing";

import { ArangoDBService } from "src/arangodb/arangodb.service";
import { MessagesService } from "src/messages/messages.service";
import { arangoDBServiceMock } from "test/mocks/arangodb.service.mock";

describe("MessagesService", () => {
	let service: MessagesService;
	let dbService: ArangoDBService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MessagesService, { provide: ArangoDBService, useValue: arangoDBServiceMock }],
		}).compile();

		service = module.get<MessagesService>(MessagesService);
		dbService = module.get<ArangoDBService>(ArangoDBService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should remove duplicates", () => {
		const result = service.removeDuplicates(["a", "b", "a", "c"]);

		expect(result).toEqual(["a", "b", "c"]);
	});

	it("should correctly process route", () => {
		const parsedRoutes = {};
		const usedKeys: string[] = [];
		expect(
			service.processRoute({ from: "Garry", to: ["Ron", "Tomas"] }, usedKeys, parsedRoutes)
		).toEqual(["Ron", "Tomas"]);
		expect(parsedRoutes).toEqual({ Garry: ["Ron", "Tomas"] });
		expect(usedKeys).toEqual(["Ron", "Tomas"]);

		expect(service.processRoute({ from: "Garry", to: ["Ron", "Tomas", "Ron"] }, [], {})).toEqual([
			"Ron",
			"Tomas",
		]);

		expect(
			service.processRoute({ from: "Garry", to: ["Ron", "Tomas", "Ron"] }, ["Tomas"], {})
		).toEqual(["Ron"]);
	});

	it("should correctly process routes recursively", () => {
		const usedKeys: string[] = [];
		const parsedRoutes = {};
		const startRoute = {
			from: "Hermione",
			to: service.processRoute({ from: "Hermione", to: ["Garry", "Ron"] }, usedKeys, parsedRoutes),
		};

		service.processRoutesRecursively(
			[
				{ from: "Garry", to: ["Tomas", "Tomas"] }, // second route
				{ from: "Hermione", to: ["Garry", "Ron"] }, // start route
				{ from: "Ron", to: ["Tomas", "Garry", "Tomas"] }, // third route, links to Tomas and Garry are omitted because they are used
				{ from: "Nelson", to: ["Tomas"] }, // omitted route, because no link to it
			],
			startRoute,
			usedKeys,
			parsedRoutes
		);

		expect(parsedRoutes).toEqual({ Hermione: ["Garry", "Ron"], Garry: ["Tomas"] });
	});

	it("should correctly parse all routes", () => {
		const result = service.parseRawRoutes(
			[
				{ from: "Garry", to: ["Tomas", "Tomas"] }, // second route
				{ from: "Hermione", to: ["Garry", "Ron"] }, // start route
				{ from: "Ron", to: ["Tomas", "Garry", "Tomas"] }, // third route, links to Tomas and Garry are omitted because they are used
				{ from: "Nelson", to: ["Tomas"] }, // omitted route, because no link to it
			],
			"Hermione"
		);

		expect(result).toEqual({ Hermione: ["Garry", "Ron"], Garry: ["Tomas"] });
	});

	it("should return empty object if start route is not found while parsing all routes", () => {
		const result = service.parseRawRoutes(
			[
				{ from: "Garry", to: ["Tomas", "Tomas"] },
				{ from: "Hermione", to: ["Garry", "Ron"] },
				{ from: "Ron", to: ["Tomas", "Garry", "Tomas"] },
				{ from: "Nelson", to: ["Tomas"] },
			],
			"Someone"
		);

		expect(result).toEqual({});
	});
});
