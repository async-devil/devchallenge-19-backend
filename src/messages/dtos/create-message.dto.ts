export class CreateMessageDto {
	public text: string;

	public topics: Array<string>;

	public from_person_id: string;

	public min_trust_level: number;
}
