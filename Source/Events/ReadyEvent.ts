import BaseEvent from "../Base/BaseEvent";
import { LensClient } from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: LensClient) {
		super(client, "ready");
	}

	public async listener() {
		this.client.logger.success("client", `Logged in as ${this.client.user?.tag}`);

		this.client.prefixes.push({
			type: "ping",
			string: `<@${this.client.user?.id}>`,
		});

		this.client.prefixes.push({
			type: "ping",
			string: `<@!${this.client.user?.id}>`,
		});
	}
};