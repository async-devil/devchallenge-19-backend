import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ArrayCursor } from "arangojs/cursor";

import { ArangoDBService } from "src/arangodb/arangodb.service";
import { TrustConnectionEntity } from "src/arangodb/entities/TrustConnection.schema";
import { TrustConnectionsService } from "src/trust-connections/trust-connections.service";
import { arangoDBServiceMock } from "test/mocks/arangodb.service.mock";
import { trustConnectionStub, trustConnectionUpdatedStub } from "test/stubs/trust-connection.stub";

describe("TrustConnectionsService", () => {
	let service: TrustConnectionsService;
	let dbService: ArangoDBService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TrustConnectionsService,
				{ provide: ArangoDBService, useValue: arangoDBServiceMock },
			],
		}).compile();

		service = module.get<TrustConnectionsService>(TrustConnectionsService);
		dbService = module.get<ArangoDBService>(ArangoDBService);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should update trust connection", async () => {
		jest
			.spyOn(dbService.trustConnections, "update")
			.mockResolvedValueOnce(trustConnectionUpdatedStub());

		const result = await service.updateTrustConnection("1111", 4);

		expect(result).toEqual(trustConnectionUpdatedStub());
	});

	it("should create trust connection", async () => {
		jest
			.spyOn(dbService.trustConnections, "save")
			.mockResolvedValueOnce(trustConnectionUpdatedStub());

		const result = await service.createTrustConnection("Garry", "Ron", 4);

		expect(result).toEqual(trustConnectionUpdatedStub());
	});

	it("should throw on non found vertex when creating", async () => {
		jest
			.spyOn(dbService.trustConnections, "save")
			.mockRejectedValueOnce(new Error("document not found"));

		await expect(service.createTrustConnection("Garry", "Eutehosutnaoheu", 4)).rejects.toThrow(
			NotFoundException
		);
	});

	it("should get trust connection", async () => {
		jest.spyOn(dbService.db, "query").mockResolvedValue({
			count: 1,
			all: async () => [trustConnectionStub()],
		} as ArrayCursor<TrustConnectionEntity>);

		const result = await service.getTrustConnection("Garry", "Ron");

		expect(result).toEqual(trustConnectionStub());
	});

	it("should throw on non found trust connection", async () => {
		jest.spyOn(dbService.db, "query").mockResolvedValue({
			count: 0,
			all: async () => [],
		} as ArrayCursor<TrustConnectionEntity>);

		await expect(service.getTrustConnection("Garry", "eaute")).rejects.toThrow(NotFoundException);
	});

	it("should throw on non valid trust level", async () => {
		await expect(service.setTrustConnections("Garry", { Ron: -10 })).rejects.toThrow(
			BadRequestException
		);
	});

	it("should update if trust connection is found", async () => {
		jest.spyOn(dbService.db, "query").mockResolvedValue({
			count: 1,
			all: async () => [trustConnectionStub()],
		} as ArrayCursor<TrustConnectionEntity>);

		jest
			.spyOn(dbService.trustConnections, "update")
			.mockResolvedValueOnce(trustConnectionUpdatedStub());

		const spy = jest.spyOn(service, "updateTrustConnection");

		await service.setTrustConnections("Garry", { Ron: 5 });

		expect(spy).toBeCalledWith("1111", 5);
	});

	it("should create if trust connection is not found", async () => {
		jest.spyOn(dbService.db, "query").mockResolvedValue({
			count: 0,
			all: async () => [],
		} as ArrayCursor<TrustConnectionEntity>);

		jest
			.spyOn(dbService.trustConnections, "save")
			.mockResolvedValueOnce(trustConnectionUpdatedStub());

		const spy = jest.spyOn(service, "createTrustConnection");

		await service.setTrustConnections("Garry", { Ron: 5 });

		expect(spy).toBeCalledWith("Garry", "Ron", 5);
	});
});
