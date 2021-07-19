import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import { LensClient } from "../Base/Client";

export default class MessageEvent extends BaseEvent {
	constructor(client: LensClient) {
		super(client, "message");
	}

	public async listener(message: Message) {
		if(message.partial) await message.fetch();
		if(message.author.bot || message.webhookId) return;

		let prefix = "";

		for(const { string, type } of this.client.prefixes) {
			if(message.content.toLowerCase().startsWith(string)) {
				// @ts-ignore
				if(type === "ping") message.mentions.users.delete(message.mentions.users.first()?.id);

				prefix = string;
				break;
			}
		}

		if(prefix.length === 0) return;

		const [commandName, ...args] = message.content.slice(prefix.length).split(/ +/g);

		const command = this.client.commands.get(commandName);
		if(!command) return;

		try {
			await command.handler(message, args);
		}
		catch(err) {
			this.client.logger.error("client/commands", stripIndents`
				Error on command ${command.name}
				Message: ${err.message}
				Stack: ${err.stack}
			`);
		}
	}
}