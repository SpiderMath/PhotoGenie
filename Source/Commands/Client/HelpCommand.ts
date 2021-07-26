import { Message } from "discord.js";
import { join } from "path";
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
			usage: "[command name]",
		});
	}

	public async handler(message: Message, args: string[]) {
		const commandName = args[0];
		const categoryMap = await this.client.util.loadJSON<any>(join(__dirname, "../../../Assets/JSON/CommandMap.json"));

		if(!commandName) {
			// Show all commands
			const helpEmbed = this.embed(message.author)
				.setTitle("Help Menu")
				// @ts-ignore
				.setThumbnail(this.client.user?.displayAvatarURL({ dynamic: true }))
				.setFooter(`© ${this.client.user?.username} ${new Date().getUTCFullYear()}`);

			const categories = this.client.commands.getCategories();

			for(const category of categories) {
				if(category === "admin" && message.author.id !== process.env.OWNER) continue;
				let string = "";
				const commands = this.client.commands.getCommandsByCategory(category);

				for(const command of commands) {
					string += ` \`${command.name}\` `;
				}

				// @ts-ignore
				helpEmbed.addField(categoryMap[category.toLowerCase()] || category, string, false);
			}

			return message.channel.send({
				embeds: [helpEmbed],
			});
		}

		else {
			// Show command information
			const command = this.client.commands.get(commandName);

			const commandHelpEmbed = this.embed(message.author)
				// @ts-ignore
				.setThumbnail(this.client.user?.displayAvatarURL({ dynamic: true }))
				.setFooter(`© ${this.client.user?.username} ${new Date().getUTCFullYear()}`)
				.setTitle("Command Menu");

			if(!command) return message.channel.send({ embeds: [commandHelpEmbed.setColor("RED").setDescription("Command not found!")] });

			message.channel.send({
				embeds: [
					commandHelpEmbed
						.addField("❯ Name", command.name, true)
						.addField("❯ Description", command.description, true)
						.addField("❯ Aliases", command.aliases.length > 0 ? `\`${command.aliases.join("`, `")}\`` : "None", true)
						.addField("❯ Cooldown", `${command.cooldown} seconds`, true)
						.addField("❯ Category", categoryMap[command.category.toLowerCase()] || command.category, true)
						.addField("❯ Usage", `{prefix}${command.name} ${command.usage}`, true)
						.addField("❯ Hidden", command.hidden ? "Yes" : "No", true),
				],
			});
		}
	}
}