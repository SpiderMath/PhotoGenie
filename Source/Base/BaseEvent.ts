import { ClientEvents } from "discord.js";
import { LensClient } from "./Client";

interface EventConfig {
	name: keyof ClientEvents;
};

export default abstract class BaseEvent {
	public client: LensClient;
	public name: keyof ClientEvents;

	constructor(client: LensClient, configuration: EventConfig) {
		this.client = client;
		this.name = configuration.name;

		Object.defineProperty(this, "client", {
			configurable: true,
			enumerable: false,
			writable: false,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract listener(...args: any[]): Promise<any>
}