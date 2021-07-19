import { ClientEvents } from "discord.js";
import { LensClient } from "./Client";

export default abstract class BaseEvent {
	public client: LensClient;
	public name: keyof ClientEvents;

	constructor(client: LensClient, name: keyof ClientEvents) {
		this.client = client;
		this.name = name;

		Object.defineProperty(this, "client", {
			configurable: true,
			enumerable: false,
			writable: false,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract listener(...args: any[]): Promise<any>
}