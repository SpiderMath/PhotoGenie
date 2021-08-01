import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class FacepalmCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "facepalm",
			description: "Makes a user facepalm",
			options: [
				{
					name: "facepalmer",
					description: "The user who is facepalming",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("facepalmer") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Facepalm.png"));
		const canvas = createCanvas(632, 357);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 632, 357);

		ctx.drawImage(avatar, 199, 112, 235, 235);
		ctx.drawImage(base, 0, 0, 632, 357);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "facepalm.png"),
			],
		});
	}
};