import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class SepiaCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "sepia",
			description: "Applies the sepia filter on an Image",
			options: [
				{
					name: "user",
					description: "The user on whose avatar you want to apply the filter",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = imgData.data[i] * 0.393 + imgData.data[i + 1] * 0.769 + imgData.data[i + 2] * 0.189;
			imgData.data[i + 1] = imgData.data[i] * 0.349 + imgData.data[i + 1] * 0.686 + imgData.data[i + 2] * 0.168;
			imgData.data[i + 2] = imgData.data[i] * 0.272 + imgData.data[i + 1] * 0.534 + imgData.data[i + 2] * 0.131;
		}

		ctx.putImageData(imgData, 0, 0);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), `sepia-${user.username}.png`),
			],
		});
	}
}