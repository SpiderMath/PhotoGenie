import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class PixelateCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "pixelate",
			description: "Pixelates a user's avatar",
			options: [
				{
					name: "user",
					description: "The user you want to pixelate the avatar of",
					type: "USER",
					required: false,
				},
				{
					name: "pixelation_coefficient",
					description: "The number of pixels you want to pixelate the avatar to",
					type: "INTEGER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;
		let coefficient = interaction.options.getInteger("pixelation_coefficient") || 100;

		if(coefficient < 1) coefficient = 100;
		if(coefficient > 100) coefficient = 100;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));

		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext("2d");

		const pixels = coefficient / 100;

		ctx.drawImage(avatar, 0, 0, canvas.width * pixels, canvas.height * pixels);
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(canvas, 0, 0, canvas.width * pixels, canvas.height * pixels, 0, 0, canvas.width + 5, canvas.height + 5);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "pixelated.png"),
			],
		});
	}
};