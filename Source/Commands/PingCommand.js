module.exports = {
	name: 'ping',
	aliases: ['latency'],
	description: '',
	timeout: 3,
	async run() {
		console.log('Ping');
	},
};