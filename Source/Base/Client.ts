import { Client, Collection } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { AsciiTable } from "../Packages/AsciiTable";
import Logger from "../Packages/Logger";
import BaseEvent from "./BaseEvent";
import BaseSlashCommand from "./BaseSlashCommand";

export default class PhotoGenieClient extends Client {
	public commands: Collection<string, BaseSlashCommand> = new Collection();
	public logger = new Logger();
	public emotes = {
		error: "",
	};

	constructor() {
		super({
			intents: [
				"GUILD_MEMBERS",
				"GUILDS",
			],
			ws: {
				properties: { $browser: "Discord Android" },
			},
		});
	}

	public async start(config: { commandDir: string, eventDir: string }) {
		await this._loadEvents(config.eventDir);
		await this._loadCommands(config.commandDir);
		this.login(process.env.TOKEN);
	}

	private async _loadCommands(commandDir: string) {
		const table = new AsciiTable("Commands");
		const subDirs = await readdir(commandDir);
		table.setHeading("Name", "Load Status");

		// I don't really need this, but to be honest, I think I will still do it to keep my Commands folder clean
		for(const subDir of subDirs) {
			const files = await readdir(join(commandDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));

				const pull: BaseSlashCommand = new pseudoPull.default(this);

				this.commands.set(pull.config.name.toLowerCase(), pull);

				table.addRow(pull.config.name, "👀");
			}
		}

		this.logger.success("client/commands", table.toString());
	}

	private async _loadEvents(eventDir: string) {
		const table = new AsciiTable("Events");
		const files = await readdir(eventDir);
		table.setHeading("Name", "Load Status");

		for(const file of files) {
			const pseudoPull = await import(join(eventDir, file));

			const pull: BaseEvent = new pseudoPull.default(this);

			this.on(pull.name, async (...args) => await pull.handler(...args));
			table.addRow(pull.name, "👂");
		}

		this.logger.success("client/events", table.toString());
	}
};