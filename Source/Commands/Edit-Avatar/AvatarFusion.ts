import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class AvatarFusionCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "avatarfusion",
			description: "Fuse 2 users' avatars into one",
			options: [
				{
					name: "user1",
					description: "The first user",
					type: "USER",
					required: true,
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

		const canvas = createCanvas(512, 512);
		const ctx = canvas.getContext("2d");

		ctx.globalAlpha = 0.5;

		ctx.drawImage(avatar1, 0, 0, 512, 512);
		ctx.drawImage(avatar2, 0, 0, 512, 512);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), `fusion-${user1?.username}-${user2.username}.png`),
			],
		});
	}
};