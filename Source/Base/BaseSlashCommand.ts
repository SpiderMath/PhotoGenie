import { MessageEmbed, ColorResolvable, ApplicationCommandData, CommandInteraction, User } from "discord.js";
import PhotoGenieClient from "./Client";

export default abstract class BaseSlashCommand {
	public client: PhotoGenieClient;
	public config: ApplicationCommandData = {
		name: "",
		description: "",
	};

	constructor(client: PhotoGenieClient, configuration: ApplicationCommandData) {
		this.client = client;
		Object.assign(this.config, configuration);
		Object.defineProperty(this, "client", {
			configurable: true,
			enumerable: false,
			writable: true,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(interaction: CommandInteraction): Promise<any>

	public embed(user: User, colour: ColorResolvable = "GREEN") {
		return new MessageEmbed()
			.setColor(colour)
			.setTimestamp()
			.setAuthor(user.username, user.displayAvatarURL({ dynamic: true }) || user.defaultAvatarURL);
	}
};