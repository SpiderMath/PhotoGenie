import { config } from "dotenv";
import { join } from "path";
import PhotoGenieClient from "./Base/Client";
config();

new PhotoGenieClient()
	.start({
		commandDir: join(__dirname, "Commands"),
		eventDir: join(__dirname, "Events"),
	});