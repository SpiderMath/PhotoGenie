import { Collection } from "discord.js";
import BaseCommand from "./BaseCommand";

export default class CommandManager {
	private _aliases: Collection<string, BaseCommand> = new Collection();
	private _commands: Collection<string, BaseCommand> = new Collection();

	public async set(pull: BaseCommand) {
		this._commands.set(pull.name.toLowerCase(), pull);
		for(const alias of pull.aliases) this._aliases.set(alias.toLowerCase(), pull);
	}

	public async get(commandName: string) {
		const command = this._commands.get(commandName.toLowerCase()) || this._aliases.get(commandName.toLowerCase());

		return command;
	}
}