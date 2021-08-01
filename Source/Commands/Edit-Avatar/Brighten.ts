import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class BrightenCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "brighten",
			description: "Brighten a user's avatar",
			options: [
				{
					name: "user",
					description: "The user whose avatar you want to brighten",
					type: "USER",
					required: false,
				},
				{
					name: "value",
					description: "The brightness value",
					type: "INTEGER",
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;
		const ratio = interaction.options.getInteger("value") || 50;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] += ratio;
			imgData.data[i + 1] += ratio;
			imgData.data[i + 2] += ratio;
		}

		ctx.putImageData(imgData, 0, 0);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer(), `bright-${user.username}.png`),
			],
		});
	}
};