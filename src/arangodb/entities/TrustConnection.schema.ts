export class TrustConnectionSchema {
	public level: number;
}

export class TrustConnectionEntity {
	public _key: string;
	public _id: string;
	public _from: string;
	public _to: string;
	public _rev: string;
	public level: number;
}
