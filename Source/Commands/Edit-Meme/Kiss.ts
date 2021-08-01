import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class KissCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "kiss",
			description: "Make 2 users kiss each other!",
			options: [
				{
					name: "user1",
					description: "The first user",
					required: true,
					type: "USER",
				},
				{
					name: "user2",
					description: "The second user",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user1 = interaction.options.getUser("user1");
		const user2 = interaction.options.getUser("user2") || interaction.user;

		// @ts-ignore
		const avatar1 = await loadImage(user1?.displayAvatarURL({ format: "png", size: 512 }));
		const avatar2 = await loadImage(user2.displayAvatarURL({ format: "png", size: 512 }));
		const background = await loadImage(join(__dirname, "../../../Assets/Images/Kiss.png"));

		const canvas = createCanvas(background.width, background.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(avatar1, 370, 25, 200, 200);
		ctx.drawImage(avatar2, 150, 25, 200, 200);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "kiss.png"),
			],
		});
	}
};