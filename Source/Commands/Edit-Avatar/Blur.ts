import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class BlurCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "blur",
			description: "Blurs an image of a user",
			options: [
				{
					name: "user",
					description: "The user whose image you want to blur",
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

		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(avatar, 0, 0, canvas.width / 4, canvas.height / 4);
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(canvas, 0, 0, canvas.width / 4, canvas.height / 4, 0, 0, canvas.width + 5, canvas.height + 5);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "blurred.png"),
			],
		});
	}
}