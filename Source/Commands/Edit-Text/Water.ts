import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class WaterCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "water",
			description: "I prefer ___ to water",
			options: [
				{
					name: "text",
					description: "The thing preferred by the thirsty guy",
					required: true,
					type: "STRING",
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const text = interaction.options.getString("text", true).toUpperCase();

		const base = await loadImage(join(__dirname, "../../../Assets/Images/Water.jpg"));

		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		const x = text.length;
		let fontSize = 40;
		let my = 0;
		// eslint-disable-next-line no-empty
		if (x <= 15) {
		}
		else if (x <= 30) {
		  fontSize = 32;
		}
		else if (x <= 70) {
		  fontSize = 25;
		}
		else if (x <= 85) {
		  fontSize = 22;
		}
		else if (x < 100) {
		  fontSize = 18;
		}
		else if (x < 120) {
		  fontSize = 15;
		}
		else if (x < 180) {
		  my = 5;
		  fontSize = 0.0032 * (x * x) - 0.878 * x + 76.545;
		}
		else if (x < 700) {
		  my = 10;
		  fontSize = 0.0000168 * (x * x) - 0.0365 * x + 21.62;
		}
		else {
		  fontSize = 7;
		}
		ctx.font = `${fontSize}px 'Futura'`;
		ctx.translate(180, 75 - my);

		const lines = this._getLines(ctx, text, 205);
		for (let i = 0; i < lines.length; i++) {
		  ctx.fillText(lines[i], 10, (i * fontSize) + 2);
		}

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "water.png"),
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