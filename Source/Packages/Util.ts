import { readFile } from "fs/promises";
import { LensClient } from "../Base/Client";

export default class Util {
	private client: LensClient;

	public constructor(client: LensClient) {
		this.client = client;
	}

	public async loadJSON<T>(path: string): Promise<T> {
		const jsonData = await readFile(path);

		return JSON.parse(jsonData.toString());
	}
};