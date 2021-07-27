import { LensClient } from "../Base/Client";
import PllScrambler from "./Scrambler/PllScrambler";

export default class Scrambler {
	private client: LensClient;
	// @ts-ignore
	public pllScrambler: PllScrambler;

	constructor(client: LensClient) {
		this.client = client;
	}

	public async resolve() {
		this.pllScrambler = new PllScrambler(this.client);
	}
};