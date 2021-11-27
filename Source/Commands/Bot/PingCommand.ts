import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import PhotoGenieClient from "../../Base/Client";

export default class PingCommand extends BaseCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "ping",
			description: "Gets the API latency of the bot",
			aliases: [
				"latency",
			],
		});
	}

	public async run(message: Message) {
		const msg = await message.channel.send("Pinging...");

		return msg.edit(`Pong! My API latency is ${msg.createdTimestamp - message.createdTimestamp} ms & my WebSocket ping is ${this.client.ws.ping}`);
	}
}