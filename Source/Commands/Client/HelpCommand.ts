import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import { LensClient } from "../../Base/Client";

export default class HelpCommand extends BaseCommand {
	constructor(client: LensClient) {
		super(client, {
			name: "help",
			description: "Displays the help menu",
			aliases: [
				"halp",
			],
			cooldown: 5,
		});
	}

	public async handler(message: Message) {
		this.client.util.reply(message, "Hi there", false, false);
	}
}