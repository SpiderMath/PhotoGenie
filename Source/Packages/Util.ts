import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { readFile } from "fs/promises";
import { LensClient } from "../Base/Client";

export default class Util {
	private client: LensClient;

	public constructor(client: LensClient) {
		this.client = client;
	}

	public async loadJSON<T>(path: string): Promise<T> {
		const jsonData = await readFile(path);

		return JSON.parse(jsonData.toString());
	}

	public async timer(message: Message) {
		const buttonRow = new MessageActionRow();

		const timerButton = new MessageButton()
			.setCustomId("timerbut")
			.setEmoji("⏲")
			.setLabel("Start")
			.setStyle("SUCCESS");

		buttonRow.addComponents(timerButton);

		const baseEmbed = new MessageEmbed()
			.setTitle("Timer")
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setFooter(`© ${new Date().getUTCFullYear()}`)
			.setTimestamp();

		const msg = await message.channel.send({
			embeds: [
				baseEmbed
					.setColor("YELLOW")
					.setDescription("Press the Button to start the timer! (You have 3 minutes to start)"),
			],
			components: [buttonRow],
		});

		try{
			await msg.awaitMessageComponent({
				componentType: "BUTTON",
				filter: (component) => component.user.id === message.author.id,
				time: 3 * 60 * 1000,
			}).then(c => c.deferUpdate());

			// Starting the timer
			const startTime = Date.now();

			buttonRow.spliceComponents(0, 1, timerButton.setLabel("Stop").setEmoji("🚏").setStyle("DANGER"));

			await msg.edit({
				embeds: [
					baseEmbed
						.setColor("YELLOW")
						.setDescription("Timer started! Please click the button (For certain limitations, the timer will only run for 10 minutes, so please end it by then)"),
				],
				components: [buttonRow],
			});

			try {
				await msg.awaitMessageComponent({
					componentType: "BUTTON",
					filter: (component) => component.user.id === message.author.id,
					time: 10 * 60 * 1000,
				}).then(c => c.deferUpdate());

				const stopTime = Date.now();

				buttonRow.spliceComponents(0, 1, timerButton.setLabel("Finished").setEmoji("😎").setStyle("SUCCESS").setDisabled(true));
				await msg.edit({
					embeds: [
						baseEmbed
							.setColor("GREEN")
							.setDescription(`You took ${stopTime - startTime}`),
					],
					components: [buttonRow],
				});

				return stopTime - startTime;
			}
			catch {
				buttonRow.spliceComponents(0, 1, timerButton.setLabel("Terminated").setEmoji("❌").setStyle("DANGER").setDisabled(true));

				await msg.edit({
					embeds: [
						baseEmbed
							.setColor("RED")
							.setDescription("Timer terminated due to no response in 10 minute"),
					],

				});

				return "Timer not stopped";
			}
		}
		catch {
			buttonRow.spliceComponents(0, 1, timerButton.setDisabled(true));

			msg.edit({
				embeds: [
					baseEmbed
						.setColor("RED")
						.setDescription("Stopped the timer, since you didn't click button in 60 seconds"),
				],
				components: [buttonRow],
			});

			return "Timer not started";
		}
	}

	public disableOneButton(buttonRow: MessageActionRow, component: ButtonInteraction) {
		const index = buttonRow.components.findIndex(comp => comp.customId === component.customId);
		const datButton = buttonRow.components[index];

		buttonRow.spliceComponents(index, 1, datButton.setDisabled(true));
	}
};