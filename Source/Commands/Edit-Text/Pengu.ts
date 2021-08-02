import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class PenguCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "pengu",
			description: "Make pengu go around with your text",
			options: [
				{
					name: "text",
					description: "The text you want Pengu to carry",
					type: "STRING",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const text = interaction.options.getString("text", true);

		const base = await loadImage(join(__dirname, "../../../Assets/Images/Pengu.jpg"));
		const canvas = createCanvas(base.width, base.height);

		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
		ctx.rotate(-0.05);

		const x = text.length;
		let fontSize = 100;
		if (x <= 15) {
			ctx.translate(175, 420);
			// do nothing
		}
		else if (x <= 30) {
			fontSize = 85;
			ctx.translate(180, 400);
		}
		else if (x <= 70) {
			fontSize = 60;
			ctx.translate(180, 400);
		}
		else if (x <= 85) {
			fontSize = 55;
			ctx.translate(180, 400);
		}
		else if (x < 100) {
			fontSize = 48;
			ctx.translate(180, 400);
		}
		else if (x < 120) {
			fontSize = 40;
			ctx.translate(180, 400);
		}
		else if (x < 150) {
			fontSize = 0.0032 * (x * x) - 0.748 * x + 70.545;
			ctx.translate(180, 400);
		}
		else if (x < 700) {
			fontSize = 0.0000168 * (x * x) - 0.0369 * x + 35.62;
			ctx.translate(180, 400);
		}
		else {
			fontSize = 14;
			ctx.translate(180, 400);
		}

		ctx.font = `${fontSize}px 'Helvetica'`;

		const lines = this._getLines(ctx, text, 440);
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], 10, (i * (fontSize + 10)) + 5);
		}

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "pengu.png"),
			],
		});
	}

	private _getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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
}