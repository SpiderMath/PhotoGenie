import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";

export default class AchievementCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "achievement",
			description: "Gets you a nice achievement",
			options: [
				{
					name: "text",
					description: "The achievement text",
					type: "STRING",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		let text = interaction.options.getString("text", true);

		if(text.length > 25) text = text.slice(0, 24) + "...";

		const base = await loadImage(join(__dirname, "../../../Assets/Images/Achievement.png"));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		ctx.translate(120, 60);
		ctx.font = "24px 'Arial'";
		ctx.fillStyle = "white";

		ctx.fillText(text, 10, 22, 330);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "achievement.png"),
			],
		});
	}
}