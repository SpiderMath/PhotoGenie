import { ClientEvents } from "discord.js";
import PhotoGenieClient from "./Client";

export default abstract class BaseEvent {
	public name: keyof ClientEvents;
	public client: PhotoGenieClient;

	constructor(client: PhotoGenieClient, name: keyof ClientEvents) {
		this.name = name;
		this.client = client;

		Object.defineProperty(this, "client", {
			enumerable: false,
			configurable: true,
			writable: true,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(...args: any[]): Promise<any>
}