import { Chess, ChessInstance } from "chess.js";
import { Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import { LensClient } from "../../Base/Client";
import ChessImageGenerator from "../../Packages/DrawChessBoard";

export default class LoadFENCommand extends BaseCommand {
	constructor(client: LensClient) {
		super(client, {
			name: "loadfen",
			description: "Loads a FEN string as a board",
			usage: "<FEN String>",
		});
	}

	public async handler(message: Message, args: string[]) {
		if(!args[0]) return message.channel.send(`${this.client.emotes.error} You didn't provide a FEN String!`);
		const chess = new Chess();

		if(!chess.validate_fen(args.join(" ")).valid) return message.channel.send(`${this.client.emotes.error} Invalid FEN expression provided! (Please note that, for loading FEN here, you need to load the FEN with the colour and move arguments as well)`);

		chess.load(args.join(" "));

		const buf = await new ChessImageGenerator(chess).generateBuffer();

		const attachment = new MessageAttachment(buf, "board.png");

		const positionEmbed = this.client.util.embed(message.author)
			.setImage("attachment://board.png")
			.setTitle("Chess Position Loader")
			.addField("Turn", chess.turn() === "w" ? "White" : "Black", true)
			.addField("State", this.getState(chess), true)
			.addField("Possible Moves", chess.moves() ? `**${chess.moves().join("**, **")}**` : "None", true);

		message.channel.send({
			embeds: [positionEmbed],
			files: [attachment],
		});
	}

	private getState(chess: ChessInstance): string {
		if(chess.in_checkmate()) return "Checkmate";
		else if(chess.in_stalemate()) return "Stalemate";
		else if(chess.in_threefold_repetition()) return "Threefold Repetition";
		else if(chess.insufficient_material()) return "Insufficient Material";
		else if(chess.in_draw()) return "50 Move Rule";
		else if(chess.in_check()) return "In Check";

		return `In Progress ${this.client.emotes.loading}`;
	}
}