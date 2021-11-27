import { Message } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import PhotoGenieClient from "../Base/Client";

export default class MessageCreateEvent extends BaseEvent {
	constructor(client: PhotoGenieClient) {
		super(client, "messageCreate");
	}

	public async run(message: Message) {
		if(!message.content.startsWith(this.client.prefix)) return;

		const commandName = message.content.slice(this.client.prefix.length).trim().split(" ").shift();

		if(!commandName) return;

		const command = await this.client.commands.get(commandName);

		if(!command) return;

		try {
			command.run(message);
		}
		catch(err) {
			// @ts-ignore
			console.log(`Loser loser, you got an error: ${err.message} \n ${err.stack}`);
		}
	}
}