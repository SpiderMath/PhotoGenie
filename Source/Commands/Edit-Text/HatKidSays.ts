import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class HatKidSaysCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "hatkidsays",
			description: "Make the Hat Kid say something",
			options: [
				{
					name: "text",
					description: "The text you want the kid to say",
					type: "STRING",
					required: true,
				},
				{
					name: "smug",
					description: "Is the Hat kid smug while saying it?",
					type: "BOOLEAN",
					required: false,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const text = interaction.options.getString("text", true);
		const smug = interaction.options.getBoolean("smug", false) || false;

		const base = await loadImage(join(__dirname, `../../../Assets/Images/Hatkidsays${smug ? "_Smug" : ""}.png`));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, base.width, base.height);

		ctx.translate(500, 350);

		const fontSize = 104;

		ctx.font = `${fontSize}px 'Arial'`;
		const lines = this._getLines(ctx, text, 900);
		for (let i = 0; i < lines.length; i += 1) {
			ctx.fillText(lines[i], 0, (i * fontSize));
		}

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "hatkidsays.png"),
			],
		});
	}

	private _getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
		const lines: string[] = [];
		if (!text) return lines;

		// Start calculation
		while (text.length) {
			let i;
			for (i = text.length; ctx.measureText(text.substr(0, i)).width > maxWidth; i -= 1) ;

			const result = text.substr(0, i);

			let j;
			if (i !== text.length) for (j = 0; result.indexOf(" ", j) !== -1; j = result.indexOf(" ", j) + 1) ;

			lines.push(result.substr(0, j || result.length));

			text = text.substr(lines[lines.length - 1].length, text.length);
		}

		return lines;
	}
};