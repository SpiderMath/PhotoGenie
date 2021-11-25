import BaseEvent from "../Base/BaseEvent";
import PhotoGenieClient from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: PhotoGenieClient) {
		super(client, "ready");
	}

	public async run() {
		console.log(`Logged in as ${this.client.user?.tag}`);
	}
};