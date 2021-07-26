import { Message, PermissionResolvable, MessageEmbed, User, ColorResolvable } from "discord.js";
import { LensClient } from "./Client";

interface CommandConfig {
	name: string;
	aliases?: string[];
	cooldown?: number;
	description: string;
	clientPerms?: PermissionResolvable[];
	userPerms?: PermissionResolvable[];
	hidden?: boolean;
	usage?: string;
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
	public hidden: boolean = false;
	public usage: string = "";

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

	public embed(user: User, colour?: ColorResolvable) {
		return new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(colour || "GREEN");
	}
};