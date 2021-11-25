import { config } from "dotenv";
import PhotoGenieClient from "./Base/Client";

config();

new PhotoGenieClient()
	.start();