import { Injectable } from "@nestjs/common";
import { aql } from "arangojs";
import { ArrayCursor } from "arangojs/cursor";

import { ArangoDBService } from "src/arangodb/arangodb.service";

/** @example {from: "Garry", to: "Tomas"} */
type RawPath = {
	from: string;
	to: string;
};

@Injectable()
export class PathService {
	constructor(private readonly arangoDBService: ArangoDBService) {}

	public async getRawPaths(fromKey: string, topics: Array<string>, trustLevel: number) {
		const fromId = `people/${fromKey}`;

		const result = (await this.arangoDBService.db.query(aql`
      FOR person IN people
        // ["a", "b"], ["a", "c"] - ["b"] - 1; ["a", "b"], ["a", "c", "b"] - [] - 0
        FILTER LENGTH(MINUS(${topics}, person.topics)) == 0
        FILTER person._key != ${fromKey}
    
        FOR v, e IN OUTBOUND SHORTEST_PATH ${fromId} TO person GRAPH 'graph'
          FILTER e.level >= ${trustLevel}
        
          RETURN {
            from: DOCUMENT(e._from)._key, 
            to: DOCUMENT(e._to)._key
          }
    `)) as ArrayCursor<RawPath>;

		return await result.all();
	}

	public parseRawPaths(paths: RawPath[], fromKey: string) {
		if (paths.length === 0)
			return {
				from: fromKey,
				path: [],
			};

		const groupedPaths = this.groupPathsByStartPerson(paths, fromKey);

		groupedPaths.sort((a, b) => a.length - b.length);

		const shortestPath = groupedPaths[0];

		return {
			from: fromKey,
			path: shortestPath,
		};
	}

	/** Start person is omitted
	 * @example [{from: "Garry", to: "Ron"}, {from: "Garry", to: "Ron"}, {from: "Ron", to: "Tomas"}]
	 * @returns [["Ron"], ["Ron", "Tomas"]] */
	public groupPathsByStartPerson(paths: RawPath[], startPersonKey: string) {
		const groups: string[][] = [];
		let i = -1;

		if (paths[0].from !== startPersonKey) {
			return [[]];
		}

		for (const path of paths) {
			if (path.from === startPersonKey) {
				i += 1;
				groups[i] = [];
			}

			groups[i].push(path.to);
		}

		return groups;
	}
}
