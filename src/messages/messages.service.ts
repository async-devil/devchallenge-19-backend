import { Injectable } from "@nestjs/common";
import { aql } from "arangojs";
import { ArrayCursor } from "arangojs/cursor";

import { ArangoDBService } from "src/arangodb/arangodb.service";

/** @example {from: "Tomas", to: ["Ron"]} */
type RawRoute = { from: string; to: Array<string> };

@Injectable()
export class MessagesService {
	constructor(private readonly arangoDBService: ArangoDBService) {}

	public async getRawFilteredRoutes(fromKey: string, topics: Array<string>, trustLevel: number) {
		const fromId = `people/${fromKey}`;

		const result = (await this.arangoDBService.db.query(aql`
      FOR vertex, edge IN 1..1000 OUTBOUND ${fromId} GRAPH "graph"
        OPTIONS {order: "weighted", uniqueVertices: "path"}
    
        FILTER edge.level >= ${trustLevel}
        // ["a", "b"], ["a", "c"] - ["b"] - 1; ["a", "b"], ["a", "c", "b"] - [] - 0
        FILTER LENGTH(MINUS(${topics}, vertex.topics)) == 0
    
        COLLECT from = edge._from INTO to

        RETURN {
          from: DOCUMENT(from)._key,
          to: to[*].vertex._key
        }
    `)) as ArrayCursor<RawRoute>;

		return await result.all();
	}

	public parseRawRoutes(routes: RawRoute[], fromKey: string) {
		const startRoute = routes.find((route) => route.from === fromKey);

		if (!startRoute) return {};

		const parsedRoutes: { [key: string]: string[] } = {};
		const usedKeys = [fromKey];

		this.processRoutesRecursively(
			routes,
			{ from: fromKey, to: this.processRoute(startRoute, usedKeys, parsedRoutes) },
			usedKeys,
			parsedRoutes
		);

		return parsedRoutes;
	}

	/** Modifies usedKeys and parsedRoutes
	 * @param route route which will be parsed in depth
	 */
	public processRoutesRecursively(
		routes: RawRoute[],
		route: RawRoute,
		usedKeys: string[],
		parsedRoutes: { [key: string]: string[] }
	) {
		route.to.forEach((value) => {
			const searchRoute = routes.find((destination) => destination.from === value);

			if (searchRoute) {
				const processedRoute = this.processRoute(searchRoute, usedKeys, parsedRoutes);

				this.processRoutesRecursively(
					routes,
					{ from: value, to: processedRoute },
					usedKeys,
					parsedRoutes
				);
			}
		});
	}

	public removeDuplicates(array: Array<string>) {
		const seen = {};
		const out: Array<string> = [];

		let j = 0;
		for (const item of array) {
			if (seen[item] !== 1) {
				seen[item] = 1;
				out[j++] = item;
			}
		}
		return out;
	}

	/** Modifies usedKeys and parsedRoutes */
	public processRoute(
		route: RawRoute,
		usedKeys: string[],
		parsedRoutes: { [key: string]: string[] }
	) {
		const filteredRoute = this.removeDuplicates(
			route.to.filter((value) => usedKeys.includes(value) !== true)
		);

		usedKeys.push(...filteredRoute);

		if (filteredRoute.length !== 0) parsedRoutes[route.from] = filteredRoute;

		return filteredRoute;
	}
}
