import { Message } from "discord.js";
import PhotoGenieClient from "./Client";

interface CommandConfig {
	name: string,
	aliases?: string[],
	description: string,
}

export default abstract class BaseCommand {
	public name: string;
	public description: string;
	public aliases: string[];

	public client: PhotoGenieClient;

	constructor(client: PhotoGenieClient, config: CommandConfig) {
		this.name = config.name,
		this.description = config.description,
		this.aliases = config.aliases || [],

		this.client = client;

		Object.defineProperty(this, "client", {
			enumerable: false,
			configurable: true,
			writable: true,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(message: Message): Promise<any>
}