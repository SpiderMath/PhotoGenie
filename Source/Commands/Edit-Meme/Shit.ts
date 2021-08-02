import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class ShitCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "shit",
			description: "Well, looks like you stepped on a shit user",
			options: [
				{
					name: "user",
					description: "The person stepped on",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Shit.png"));

		const canvas = createCanvas(base.height, base.width);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(avatar, 300, 450, 225, 225);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "shit.png"),
			],
		});
	}
};