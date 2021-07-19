import { config } from "dotenv";
import { join } from "path";
config();
import { LensClient } from "./Base/Client";

new LensClient()
	.start({
		prefix: [""],
		commandDir: join(__dirname, "./Commands"),
		eventDir: join(__dirname, "./Events"),
	});