import { createCanvas, loadImage } from "canvas";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { join } from "path";
import BaseSlashCommand from "../../Base/BaseSlashCommand";
import PhotoGenieClient from "../../Base/Client";

export default class TrumplawCommand extends BaseSlashCommand {
	constructor(client: PhotoGenieClient) {
		super(client, {
			name: "trumplaw",
			description: "Make (Former) US. President Donald Trump sign a law for ye",
			options: [
				{
					name: "text",
					description: "The text you want to be signed into law",
					type: "STRING",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const text = interaction.options.getString("text", true);

		const base = await loadImage(join(__dirname, "../../../Assets/Images/Trumplaw.jpg"));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		const x = text.length;
		let fontSize = 53;

		if (x < 15) {
			ctx.translate(565, 300);
		}

		else if (x < 25) {
			fontSize = 42;
			ctx.translate(565, 300);
		}

		else if (x < 370) {
			fontSize = Math.floor(0.0003 * (x * x) - 0.1875 * x + 40.37);
			ctx.translate(565, 285);
		}

		else if (x < 1300) {
			fontSize = Math.floor(0.00000915 * (x * x) - 0.018 * x + 17.45);
			ctx.translate(565, 275);
		}

		else {
			fontSize = 4.5;
			ctx.translate(565, 290);
		}

		ctx.font = `${fontSize}px 'Arial'`;
		ctx.rotate(0.12);

		const lines = this._getLines(ctx, text, 175);

		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], 0, (i * fontSize));
		}

		return interaction.editReply({
			files: [
				new MessageAttachment(canvas.toBuffer("image/png"), "trumplaw.png"),
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