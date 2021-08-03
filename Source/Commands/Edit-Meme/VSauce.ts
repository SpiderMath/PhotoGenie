import PhotoGenieClient from "../../Base/Client";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";

export default class VSauceCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "vsauce",
			description: "VSauce!",
			options: [
				{
					name: "user",
					description: "The user, or is it?",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ size: 512, format: "png" }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/VSauce.png"));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "vsauce.png"),
			],
		});
	}
};