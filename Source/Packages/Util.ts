import { readFile } from "fs/promises";

export default class Util {
	public async loadJSON(path: string): Promise<any> {
		const jsonData = await readFile(path);

		return JSON.parse(jsonData.toString());
	}
};