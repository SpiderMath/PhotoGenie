import { readFile } from "fs/promises";

export default class Util {
	public async loadJSON<T>(path: string): Promise<T> {
		const jsonData = await readFile(path);

		return JSON.parse(jsonData.toString());
	}
};