import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class SpankCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "spank",
			description: "Make someone spank someone else",
			options: [
				{
					name: "spanked",
					description: "The person who'll be spanked",
					type: "USER",
					required: true,
				},
				{
					name: "spanker",
					description: "The person who will spank the target",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const spankerUser = interaction.options.getUser("spanker") || interaction.user;
		const spankedUser = interaction.options.getUser("spanked");

		const spanker = await loadImage(spankerUser.displayAvatarURL({ format: "png", size: 512 }));
		// @ts-ignore
		const spanked = await loadImage(spankedUser.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Spank.png"));

		const canvas = createCanvas(500, 500);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		ctx.drawImage(spanked, 350, 220, 120, 120);
		ctx.drawImage(spanker, 225, 5, 140, 140);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "spank.png"),
			],
		});
	}
};