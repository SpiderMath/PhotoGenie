import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import { LensClient } from "../../Base/Client";

export default class PingCommand extends BaseCommand {
	public constructor(client: LensClient) {
		super(client, {
			name: "ping",
			aliases: [],
			description: "Gets the API Latency of the Bot",
		});
	}

	public async handler(message: Message) {
		const msg = await this.client.util.sendEmbeds(message, this.client.util.embed(message.author, "YELLOW")
			.setDescription("Pinging...."),
		);

		return msg
			.edit({
				embeds: [
					this.client.util.embed(message.author)
						.setTitle("API Latency")
						.setDescription(
							stripIndents`
								Heartbeat 💝: ${this.client.ws.ping}ms
								Roundtrip 💞: ${msg.createdTimestamp - message.createdTimestamp}ms
							`,
						),
				],
			});
	}
}