import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import GIFEncoder from "gifencoder";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class TriggerCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "trigger",
			description: "Triggers someone's avatar",
			options: [
				{
					name: "user",
					description: "The user whom you want to trigger",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Triggered.png"));
		const GIF = new GIFEncoder(256, 310);

		GIF.start();
		GIF.setRepeat(0);
		GIF.setDelay(15);

		const canvas = createCanvas(256, 310);
		const ctx = canvas.getContext("2d");

		const BR = 30;
		const LR = 20;
		let i = 0;

		while (i < 9) {
			ctx.clearRect(0, 0, 256, 310);

			ctx.drawImage(
				avatar,
				Math.floor(Math.random() * BR) - BR,
				Math.floor(Math.random() * BR) - BR,
				256 + BR,
				310 - 54 + BR,
			);

			ctx.fillStyle = "#FF000033";

			ctx.fillRect(0, 0, 256, 310);

			ctx.drawImage(
				base,
				Math.floor(Math.random() * LR) - LR,
				310 - 54 + Math.floor(Math.random() * LR) - LR,
				256 + LR,
				54 + LR,
			);

			GIF.addFrame(ctx);

			i++;
		}

		GIF.finish();

		return interaction.editReply({
			files: [
				new MessageAttachment(GIF.out.getData(), "triggered.gif"),
			],
		});
	}
};