import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { createCanvas, loadImage } from "canvas";

export default class WideImageCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "wideimage",
			description: "Generate a Wide image of the User",
			options: [
				{
					name: "user",
					description: "The user whose avatar you want to widen",
					type: "USER",
					required: false,
				},
				{
					name: "ratio",
					description: "The ratio of the Width compared to the breadth",
					type: "STRING",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;
		const value = interaction.options.getString("ratio") as string || "2";

		let ratio = Number.parseFloat(value);
		if(!ratio) return interaction.editReply(`${this.client.emotes.error} The ratio provided has to be a number!`);

		// So that only 1 digit is taken
		ratio = Math.round(ratio * 10) / 10;

		if(ratio <= 0 || ratio > 10) return interaction.editReply(`${this.client.emotes.error} The ratio has to be between 0 and 10!`);

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 256 }));
		const canvas = createCanvas(256 * ratio, 256);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatar, 0, 0, 256 * ratio, 256);

		const wideAttachment = new MessageAttachment(canvas.toBuffer("image/png"), `wide-${user.username}.png`);

		return interaction.editReply({
			files: [
				wideAttachment,
			],
		});
	}
};