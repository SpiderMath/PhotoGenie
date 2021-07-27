import { stripIndents } from "common-tags";
import { Message, MessageActionRow, MessageButton } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import { LensClient } from "../../Base/Client";

export default class PLLScrambleCommand extends BaseCommand {
	constructor(client: LensClient) {
		super(client, {
			name: "generatepllscramble",
			aliases: ["pllscramble"],
			description: "Generates a random PLL Scramble",
		});
	}

	async handler(message: Message) {
		const scrambleData = this.client.scrambler.pllScrambler.generateScramble();

		const buttonRow = new MessageActionRow();

		const hintButton = new MessageButton()
			.setCustomId("hint")
			.setStyle("SECONDARY")
			.setLabel("Hint")
			.setEmoji("👀");

		const timerButton = new MessageButton()
			.setCustomId("timer")
			.setStyle("SECONDARY")
			.setLabel("Timer")
			.setEmoji("⏲");

		buttonRow.addComponents(hintButton, timerButton);

		const msg = await message.channel.send({
			content: scrambleData.alg,
			components: [buttonRow],
		});

		const componentCollector = msg.createMessageComponentCollector({
			time: 30 * 1000,
			componentType: "BUTTON",
			filter: (comp) => comp.user.id === message.author.id,
		});

		componentCollector.on("collect", async (component) => {
			// Return if not a button
			if(!component.isButton()) return;

			this.client.util.disableOneButton(buttonRow, component);

			// If the user presses the hint button, show a hint
			if(component.customId === "hint") {
				component.update({
					content: stripIndents`
						Scramble: ${scrambleData.alg}
						PLL: ${scrambleData.pll}
					`,
					components: [buttonRow],
				});
			}
			else if(component.customId === "timer") {
				component.deferUpdate();
				// If the user presses the timer button, start the timer
				const timer = await this.client.util.timer(message);

				msg.edit({
					content: stripIndents`
						Scramble: ${scrambleData.alg}
						PLL: ${scrambleData.pll}
						Time: ${timer}
					`,
					components: [buttonRow],
				});
			}
		});
	}
}