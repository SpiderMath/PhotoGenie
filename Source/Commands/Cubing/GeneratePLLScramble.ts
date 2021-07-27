import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import { LensClient } from "../../Base/Client";

export default class PLLScrambleCommand extends BaseCommand {
	constructor(client: LensClient) {
		super(client, {
			name: "generatepllscramble",
			aliases: ["pllscramble"],
			description: "Generates a random PLL Scramble",
		});
	}

	async handler(message: Message) {
		return message.channel.send(this.client.scrambler.pllScrambler.generateScramble());
	}
}