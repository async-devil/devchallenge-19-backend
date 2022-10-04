import { TrustConnectionEntity } from "src/arangodb/entities/TrustConnection.schema";

export const trustConnectionStub: () => TrustConnectionEntity = () => {
	return {
		_id: "trust_connection/1111",
		_key: "1111",
		_rev: "auc",
		_from: "people/Garry",
		_to: "people/Ron",
		level: 4,
	};
};

export const trustConnectionUpdatedStub = (level = 4) => {
	return {
		_id: "trust_connections/1111",
		_key: "1111",
		_rev: "auc",
		new: {
			_from: "Garry",
			_to: "Ron",
			_id: "trust_connections/1111",
			_key: "1111",
			_rev: "auc",
			level,
		},
	};
};
