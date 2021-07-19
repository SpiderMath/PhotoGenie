import { Client } from "discord.js";
import { readdir } from "fs/promises";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";
import CommandManager from "./CommandManager";
import Util from "../Packages/Util";
import { AsciiTable } from "../Packages/AsciiTable";

interface StartParams {
	prefix: string[];
	eventDir: string;
	commandDir: string;
}

export class LensClient extends Client {
	public prefixes: Array<{ type: "ping" | "string", string: string }> = [];
	public commands = new CommandManager();
	public util = new Util();

	constructor() {
		super({
			intents: 32767,
			ws: {
				properties: { $browser: "Discord Android" },
			},
		});
	}

	public async start(config: StartParams) {
		config.prefix.forEach((pref) => this.prefixes.push({ type: "ping", string: pref }));
		await this._loadEvents(config.eventDir);
		await this._loadCommands(config.commandDir);

		this.login(process.env.TOKEN);
	}

	private async _loadEvents(eventDir: string) {
		const table = new AsciiTable("Events")
			.setHeading("Name", "Status");
		const eventFiles = await readdir(eventDir);

		for(const file of eventFiles) {
			const pseudoPull = await import(`${eventDir}/${file}`);
			const pull: BaseEvent = new pseudoPull.default(this);

			this.on(pull.name, async (...args: any[]) => await pull.listener(...args));
			table.addRow(pull.name, "👂");
		}

		console.log(table.toString());
	}

	private async _loadCommands(commandDir: string) {
		const table = new AsciiTable("Commands")
			.setHeading("Name", "Category", "Load Status");

		const subDirs = await readdir(commandDir);

		for(const subDir of subDirs) {
			const commandFiles = await readdir(`${commandDir}/${subDir}`);

			for(const file of commandFiles) {
				const pseudoPull = await import(`${commandDir}/${subDir}/${file}`);
				const pull: BaseCommand = new pseudoPull.default(this);

				pull.category = subDir;

				table.addRow(
					pull.name,
					pull.category,
					"👀",
				);

				this.commands.register(pull);
			}
		}

		console.log(table.toString());
	}
}