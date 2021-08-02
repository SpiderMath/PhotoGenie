import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class BazingaCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "bazinga",
			description: "Bazinga!",
			options: [
				{
					name: "user",
					description: "Do I need to tell ya?",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Bazinga.png"));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "Bazinga.png"),
			],
		});
	}
};