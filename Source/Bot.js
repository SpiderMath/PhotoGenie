// Importing env stuff
require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

// Definitions
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

const commands = new Collection();
const aliases = new Collection();
const timeouts = new Collection();

// Loading commands
const files = readdirSync(join(__dirname, './Commands/'));

for(const file of files) {
	const pull = require(join(__dirname, `./Commands/${file}`));

	for(const alias of pull.aliases) aliases.set(alias, pull.name);

	commands.set(pull.name, pull);
	timeouts.set(pull.name, pull.timeout);
}

// Events
client
	.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}`);
	})
	.on('messageCreate', (message) => {
		if(!message.content.startsWith(process.env.PREFIX)) return;

		const args = message.content.slice(process.env.PREFIX.length).split(/ +/g);
		const commandName = args.shift().toLowerCase();

		const command = commands.get(commandName) || commands.get(aliases.get(commandName));

		if(!command) return 0;
	});

// Logging the bot in
// client.login(process.env.DISCORD_TOKEN);