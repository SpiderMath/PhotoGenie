import { Client, Intents } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";
import CommandManager from "./CommandManager";

export default class PhotoGenieClient extends Client {
	public commands = new CommandManager();
	public prefix = process.env.PREFIX || ".";

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MEMBERS,
			],
			ws: {
				properties: { $browser: "Discord Android" },
			},
		});
	}

	public async start() {
		await this.__loadEvents();
		await this.__loadCommands();
		this.login(process.env.DISCORD_TOKEN);
	}

	private async __loadCommands() {
		const subDirs = await readdir(join(__dirname, "../Commands"));

		for(const subDir of subDirs) {
			const files = await readdir(join(__dirname, "../Commands", subDir));

			for(const file of files) {
				const pseudoPull = await import(join(__dirname, "../Commands", subDir, file));
				const pull: BaseCommand = new pseudoPull.default(this);

				this.commands.set(pull);
				console.log(`Loaded command ${pull.name}`);
			}
		}
	}

	private async __loadEvents() {
		const files = await readdir(join(__dirname, "../Events"));

		for(const file of files) {
			const pseudoPull = await import(join(__dirname, "../Events", file));
			const pull: BaseEvent = new pseudoPull.default(this);

			this.on(pull.name, async (...args) => pull.run(...args));
			console.log(`Listening for command ${pull.name}`);
		}
	}
};