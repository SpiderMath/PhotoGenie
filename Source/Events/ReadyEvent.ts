import BaseEvent from "../Base/BaseEvent";
import PhotoGenieClient from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: PhotoGenieClient) {
		super(client, "ready");
	}

	public async handler() {
		this.client.logger.success("client", `Logged in as ${this.client.user?.tag}`);
		await this.client.guilds.fetch();

		await this.client.guilds.cache.get("839534136548786206")?.commands.set(this.client.commands.map(c => c.config));
	}
};