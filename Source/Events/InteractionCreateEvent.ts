import { stripIndents } from "common-tags";
import { CommandInteraction, Interaction } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import PhotoGenieClient from "../Base/Client";

export default class InteractionCreateEvent extends BaseEvent {
	constructor(client: PhotoGenieClient) {
		super(client, "interactionCreate");
	}

	public async handler(interaction: Interaction) {
		// Here I got some kind of interaction, which I need to determine in here.
		if(interaction.isCommand()) return await this.handleCommand(interaction as CommandInteraction);
	}

	private async handleCommand(interaction: CommandInteraction) {
		// Here I am gonna deal with the command interaction.

		const commandName = interaction.commandName;

		const command = this.client.commands.get(commandName);

		// Personal Preference to just defer it just in case.
		interaction.defer();

		try {
			command?.run(interaction);
		}
		catch(err) {
			// I'll just say something went wrong

			this.client.logger.error("client/commands", stripIndents`
				Error on command "${commandName}"
				Error Message: ${err.message}
				Error Stack: ${err.stack}
			`);

			interaction.reply(stripIndents`
				${this.client.emotes.error} Something went wrong while executing the command, please contact the owner for resolving the issue.
				Error: ${err.message}
			`);
		}
	}
};