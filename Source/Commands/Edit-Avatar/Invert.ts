import { CanvasRenderingContext2D, createCanvas, Image, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class InvertCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "invert",
			description: "Invert a user's image",
			options: [
				{
					name: "user",
					description: "The user whose image you want to invert",
					type: "USER",
					required: false,
				},
				{
					name: "type",
					description: "The type of invertion you want to do",
					type: "STRING",
					required: false,
					choices: [
						{
							name: "Lateral Invertion",
							value: "lateral",
						},
						{
							name: "Diagonal Invertion",
							value: "diagonal",
						},
						{
							name: "Color Invertion",
							value: "color",
						},
						{
							name: "Vertical Invertion",
							value: "vertical",
						},
					],
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") || interaction.user;
		const inversionType = interaction.options.getString("type") || "color";

		const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
		const canvas = createCanvas(512, 512);
		const ctx = canvas.getContext("2d");

		if(inversionType === "lateral") {
			this.flipImage(avatar, ctx, true, false);
		}
		else if(inversionType === "diagonal") {
			this.flipImage(avatar, ctx, true, true);
		}
		else if(inversionType === "vertical") {
			this.flipImage(avatar, ctx, false, true);
		}
		else {
			ctx.drawImage(avatar, 0, 0, 512, 512);
			ctx.globalCompositeOperation = "difference";
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), `${inversionType}-${user.username}.png`),
			],
		});
	}

	private flipImage(image: Image, ctx: CanvasRenderingContext2D, flipH: boolean, flipV: boolean) {
		const scaleH = flipH ? -1 : 1,
			scaleV = flipV ? -1 : 1,
			posX = flipH ? -512 : 0,
			posY = flipV ? -512 : 0;

		ctx.save();
		ctx.scale(scaleH, scaleV);
		ctx.drawImage(image, posX, posY, 512, 512);
		ctx.restore();
	};
};