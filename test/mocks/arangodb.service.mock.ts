export const arangoDBServiceMock = {
	people: {
		save: jest.fn,
		update: jest.fn,
		remove: jest.fn,
	},
	trustConnections: {
		save: jest.fn,
		update: jest.fn,
		remove: jest.fn,
	},
	db: {
		query: jest.fn,
	},
};
