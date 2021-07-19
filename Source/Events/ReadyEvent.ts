import BaseEvent from "../Base/BaseEvent";
import { LensClient } from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: LensClient) {
		super(client, {
			name: "ready",
		});
	}

	async listener() {
		this.client.logger.success("client", `Logged in as ${this.client.user?.tag}`);
	}
};