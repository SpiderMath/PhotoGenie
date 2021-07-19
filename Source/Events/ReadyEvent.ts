import BaseEvent from "../Base/BaseEvent";
import { LensClient } from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: LensClient) {
		super(client, {
			name: "ready",
		});
	}

	async listener() {
		console.log(`Logged in as ${this.client.user?.tag}`);
	}
};