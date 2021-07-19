import { ColorResolvable, Message, MessageEmbed, User } from "discord.js";

export default class Util {
	public embed(user: User, colour?: ColorResolvable) {
		return new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(colour || "GREEN");
	}

	async sendEmbeds(message: Message, embeds: MessageEmbed | MessageEmbed[]) {
		return await message.channel.send({
			embeds: Array.isArray(embeds) ? embeds : [embeds],
		});
	}
};