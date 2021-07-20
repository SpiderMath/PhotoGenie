import { ColorResolvable, Message, MessageEmbed, User } from "discord.js";
import { readFile } from "fs/promises";

export default class Util {
	public embed(user: User, colour?: ColorResolvable) {
		return new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(colour || "GREEN");
	}

	public async sendEmbeds(message: Message, embeds: MessageEmbed | MessageEmbed[]) {
		return await message.channel.send({
			embeds: Array.isArray(embeds) ? embeds : [embeds],
		});
	}

	public async loadJSON(path: string): Promise<any> {
		const jsonData = await readFile(path);

		return JSON.parse(jsonData.toString());
	}
};