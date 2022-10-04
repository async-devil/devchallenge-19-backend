import { CreatePersonDto } from "src/people/dtos/create-person.dto";

export const personStub = (dto?: CreatePersonDto) => {
	return Object.assign(
		{
			id: "Ron",
			topics: ["books"],
		},
		dto
	);
};

export const personUpdatedStub = (topics: string[] = []) => {
	return {
		_id: "people/Ron",
		_key: "Ron",
		_rev: "eeeee",
		new: { _id: "people/Ron", _key: "Ron", _rev: "eeeee", topics },
	};
};
