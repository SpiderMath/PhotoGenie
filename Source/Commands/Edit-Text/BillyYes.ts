import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class BillyYesCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "billyyes",
			description: "Yes Billy, I'm proud of you for searching that!",
			options: [
				{
					name: "text",
					description: "The text Billy is searching",
					type: "STRING",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const text = interaction.options.getString("text", true);

		if(text.length > 25) return interaction.editReply("The text can only be 25 characters long.");

		const base = await loadImage(join(__dirname, "../../../Assets/Images/BillyYes.jpg"));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		ctx.font = "22px 'Arial'";
		await ctx.fillText(text, 270, 195);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "BillyYes.png"),
			],
		});
	}
}