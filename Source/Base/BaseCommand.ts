import { Message } from "discord.js";
import PhotoGenieClient from "./Client";
import ArgumentManager from "./ArgumentManager";

interface Argument {}

interface CommandConfig {
	name: string,
	aliases?: string[],
	description: string,
	arguments?: Argument[],
}

export default abstract class BaseCommand {
	public name: string;
	public description: string;
	public aliases: string[];
	public arguments: Argument[]

	public client: PhotoGenieClient;

	constructor(client: PhotoGenieClient, config: CommandConfig) {
		this.name = config.name,
		this.description = config.description,
		this.aliases = config.aliases || [],
		this.arguments = config.arguments || [],

		this.client = client;

		Object.defineProperty(this, "client", {
			enumerable: false,
			configurable: true,
			writable: true,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(message: Message, args: ArgumentManager): Promise<any>
}