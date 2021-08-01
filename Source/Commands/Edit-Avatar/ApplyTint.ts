import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class ApplyTintCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "applytint",
			description: "Applies a tint on someone's avatar",
			options: [
				{
					name: "colour",
					description: "The colour of the tint",
					type: "STRING",
					required: true,
				},
				{
					name: "user",
					description: "The user whose avatar you want to apply the tint to",
					type: "USER",
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const colour = interaction.options.getString("colour") || "";

		if(
			!(/^#([0-9A-F]{3}){1,2}$/i.test(colour))
		) return interaction.editReply(`${this.client.emotes.error} You did not specify a valid hex code for the colour!`);

		const avatar = await loadImage(
			(interaction.options.getUser("user") || interaction.user).displayAvatarURL({ format: "png", size: 512 }),
		);
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

		ctx.globalCompositeOperation = "color";
		ctx.fillStyle = colour;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "tint.png"),
			],
		});
	}
};