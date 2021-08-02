import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class JailCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "jail",
			description: "Put that annoying user in jail",
			options: [
				{
					name: "user",
					description: "The user to be jailed",
					type: "USER",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const base = await loadImage(join(__dirname, "../../../Assets/Images/Jail.png"));

		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height);
		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < imgData.data.length; i += 4) {
			const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
			imgData.data[i] = brightness;
			imgData.data[i + 1] = brightness;
			imgData.data[i + 2] = brightness;
		}

		ctx.putImageData(imgData, 0, 0);

		ctx.drawImage(base, 0, 0, avatar.width, avatar.height);

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "jail.png"),
			],
		});
	}
};