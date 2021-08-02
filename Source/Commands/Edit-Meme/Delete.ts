import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class DeleteCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "delete",
			description: "Delete a useless user",
			options: [
				{
					name: "user",
					description: "The user you wanna delete",
					type: "USER",
					required: false,
				},
				{
					name: "mode",
					description: "Do you want it to be in dark mode?",
					type: "BOOLEAN",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;
		const darkMode = interaction.options.getBoolean("mode") || true;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Delete.png"));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, base.width, base.height);

		if(darkMode) {
			ctx.globalCompositeOperation = "difference";
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		ctx.drawImage(avatar, 120, 135, 195, 195);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "delete.png"),
			],
		});
	}
}