import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { ArangoDBService } from "src/arangodb/arangodb.service";
import { PeopleService } from "src/people/people.service";
import { arangoDBServiceMock } from "test/mocks/arangodb.service.mock";
import { personStub, personUpdatedStub } from "test/stubs/person.stub";

describe("PeopleService", () => {
	let service: PeopleService;
	let dbService: ArangoDBService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PeopleService, { provide: ArangoDBService, useValue: arangoDBServiceMock }],
		}).compile();

		service = module.get<PeopleService>(PeopleService);
		dbService = module.get<ArangoDBService>(ArangoDBService);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should create new person", async () => {
		const person = await service.createPerson(personStub());

		expect(person).toEqual(personStub());
	});

	it("should throw on duplicate person", async () => {
		jest
			.spyOn(dbService.people, "save")
			.mockRejectedValue(
				new Error("unique constraint violated - in index primary of type primary over '_key';")
			);

		await expect(service.createPerson(personStub())).rejects.toThrow(UnprocessableEntityException);
	});

	it("should update person topics", async () => {
		const newValue = ["e"];

		jest.spyOn(dbService.people, "update").mockResolvedValue(personUpdatedStub(newValue));

		const result = await service.updatePersonTopics(personStub().id, { topics: newValue });

		expect(result).toEqual({ id: personStub().id, topics: newValue });
	});

	it("should throw on non found person", async () => {
		jest.spyOn(dbService.people, "update").mockRejectedValue(new Error("document not found"));

		await expect(service.updatePersonTopics(personStub().id, { topics: [] })).rejects.toThrow(
			NotFoundException
		);
	});
});
