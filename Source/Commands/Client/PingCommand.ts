import { CommandInteraction } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class PingCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "ping",
			description: "Gets the API Latency of the bot",
		});
	}

	public async run(interaction: CommandInteraction) {
		const pingEmbed = super.embed(interaction.user)
			.setTitle("API Latency")
			.setDescription(`🏓 🎾 Pong! My WebSocket Ping is ${this.client.ws.ping}ms`);

		interaction.editReply({
			embeds: [pingEmbed],
		});
	}
};