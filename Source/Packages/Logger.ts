export default class Logger {
	private colours = {
		red : "\x1b[31m",
		green : "\x1b[32m",
		yellow : "\x1b[33m",
		blue : "\x1b[34m",
		reset : "\u001b[0m",
	};

	private _getTimestamp() {
		return new Date().toUTCString();
	}

	public success(context: string, message: string) {
		console.log(`${this.colours.green}${this._getTimestamp()} ${context}${this.colours.reset} - ${message}`);
	}

	public warn(context: string, message: string) {
		console.log(`${this.colours.yellow}${this._getTimestamp()} ${context}${this.colours.reset} - ${message}`);
	}
	public error(context: string, message: string) {
		console.log(`${this.colours.red}${this._getTimestamp()} ${context}${this.colours.reset} - ${message}`);
	}

	public info(context: string, message: string) {
		console.log(`${this.colours.blue}${this._getTimestamp()} ${context}${this.colours.reset} - ${message}`);
	}
}
