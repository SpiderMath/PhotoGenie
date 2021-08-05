import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class TenHauntingMoments extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "10hauntingmoments",
			description: "10 Haunting Moments OMG!",
			options: [
				{
					name: "user",
					description: "The user who is haunting...",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/10hauntingmoments.png"));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(avatar, 0, 0, 500, 290);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "10hauntingMoments.png"),
			],
		});
	}
}
