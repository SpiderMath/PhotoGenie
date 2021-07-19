import { Collection } from "discord.js";
import BaseCommand from "./BaseCommand";

export default class CommandManager {
	private cache: Collection<string, BaseCommand> = new Collection();
	private aliasCache: Collection<string, string> = new Collection();

	public register(command: BaseCommand) {
		this.cache.set(command.name.toLowerCase(), command);

		command.aliases.forEach(alias => this.aliasCache.set(alias.toLowerCase(), command.name.toLowerCase()));
	}

	public get(name: string) {
		// @ts-ignore
		return this.cache.get(name.toLowerCase()) || this.cache.get(this.aliasCache.get(name.toLowerCase()));
	}
};