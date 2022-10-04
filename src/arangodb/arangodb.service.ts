import { Injectable } from "@nestjs/common";
import { Database } from "arangojs";
import { DocumentCollection } from "arangojs/collection";
import { Graph, GraphEdgeCollection, GraphVertexCollection } from "arangojs/graph";

import { PersonSchema } from "./entities/Person.schema";
import { TrustConnectionSchema } from "./entities/TrustConnection.schema";

@Injectable()
export class ArangoDBService {
	public readonly db = new Database("http://arangodb:8529");

	public readonly graph: Graph;

	public readonly people: GraphVertexCollection<PersonSchema>;
	public readonly trustConnections: GraphEdgeCollection<TrustConnectionSchema>;

	constructor() {
		this.graph = this.db.graph("graph");
		this.people = this.graph.vertexCollection("people");
		this.trustConnections = this.graph.edgeCollection("trust_connections");

		void this.init();
	}

	private async init() {
		await this.createGraphIfNotExist();
		await this.createCollectionIfNotExist(this.people.collection);
		await this.createCollectionIfNotExist(this.trustConnections.collection);
	}

	private async createGraphIfNotExist() {
		const exist = await this.graph.exists();

		if (!exist)
			await this.graph.create([
				{
					collection: this.trustConnections,
					from: this.people,
					to: this.people,
				},
			]);
	}

	private async createCollectionIfNotExist(collection: DocumentCollection) {
		const exist = await collection.exists();

		if (!exist) await collection.create();
	}
}
