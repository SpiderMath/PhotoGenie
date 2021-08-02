import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class JokeOverheadCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "jokeoverhead",
			description: "Did your joke go over someone's head? Visualise it!",
			options: [
				{
					name: "user",
					description: "The unfunny user",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Jokeoverhead.png"));

		const canvas = createCanvas(425, 404);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 425, 404);

		ctx.drawImage(avatar, 125, 130, 140, 135);
		ctx.drawImage(base, 0, 0, 425, 404);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "jokeoverhead.png"),
			],
		});
	}
}