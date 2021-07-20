import { Message, PermissionResolvable } from "discord.js";
import { LensClient } from "./Client";

interface CommandConfig {
	name: string;
	aliases?: string[];
	cooldown?: number;
	description: string;
	clientPerms?: PermissionResolvable[];
	userPerms?: PermissionResolvable[];
};

export default abstract class BaseCommand {
	public client: LensClient;
	public name: string = "";
	public category: string = "";
	public aliases: string[] = [];
	public description = "";
	public cooldown = 3;
	public clientPerms: PermissionResolvable[] = [];
	public userPerms: PermissionResolvable[] = [];

	constructor(client: LensClient, configuration: CommandConfig) {
		this.client = client;

		Object.defineProperty(this, "client", {
			enumerable: false,
			configurable: true,
			writable: false,
		});

		Object.assign(this, configuration);

		this.clientPerms.push("SEND_MESSAGES");
	}

	// eslint-disable-next-line no-unused-vars
	abstract handler(message: Message, args: String[]): Promise<any>;
};