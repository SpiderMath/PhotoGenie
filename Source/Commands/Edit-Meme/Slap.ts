import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class SlapCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "slap",
			description: "Makes one user slap the other",
			options: [
				{
					name: "slapped",
					description: "The person who is being slapped",
					type: "USER",
					required: true,
				},
				{
					name: "slapper",
					description: "The person who is slapping",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const slappedUser = interaction.options.getUser("slapped");
		const slapperUser = interaction.options.getUser("slapper") || interaction.user;

		// @ts-ignore
		const slapped = await loadImage(slappedUser?.displayAvatarURL({ format: "png", size: 512 }));
		const slapper = await loadImage(slapperUser.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Batslap.png"));

		const canvas = createCanvas(1000, 500);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(slapped, 580, 260, 200, 200);
		ctx.drawImage(slapper, 350, 70, 220, 220);

		interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "slap.png"),
			],
		});
	}
};