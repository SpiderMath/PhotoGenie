import axios from "axios";
import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import { LensClient } from "../../Base/Client";

interface LichessUserResponse {
	id: string;
	username: string;
	online: boolean;
	perfs: Perfs;
	createdAt: number;
	profile: Profile;
	seenAt: number;
	playTime: PlayTime;
	language: string;
	url: string;
	nbFollowing: number;
	nbFollowers: number;
	completionRate: number;
	count: { [key: string]: number };
}

interface Perfs {
	blitz: Performance;
	puzzle: Performance;
	bullet: Performance;
	correspondence: Performance;
	classical: Performance;
	rapid: Performance;
}

interface Performance {
	games: number;
	rating: number;
	rd: number;
	prog: number;
	prov?: boolean;
}

interface PlayTime {
	total: number;
	tv: number;
}

interface Profile {
	country: string;
	bio: string;
}


export default class LichessProfile extends BaseCommand {
	constructor(client: LensClient) {
		super(client, {
			name: "lichessprofile",
			aliases:["viewlichessprofile", "lichess_profile"],
			description: "Let's you view a person's Lichess profile",
			usage: "<Lichess User ID>",
			cooldown: 5,
		});
	}

	public async handler(message: Message, args: string[]) {
		if(!args[0]) return message.channel.send(`${this.client.emotes.error} No username provided`);

		const username = args[0];

		const response = (await axios.get(`https://lichess.org/api/user/${username}`));

		if(response.status === 404) return message.channel.send(`${this.client.emotes.error} This user does not exist`);

		const data = response.data as LichessUserResponse;

		const profileEmbed = this.client.util.embed(message.author)
			.setTitle("Lichess User Profile")
			.addField("❯ Username", data.username, true)
			.addField("❯ Bio", data.profile.bio.length > 30 ? data.profile.bio.substring(0, 30) + "..." : data.profile.bio, true)
			.addField("❯ Created At", new Date(data.createdAt).toUTCString(), true)
			.addField("❯ Language", data.language, true)
			.addField("❯ Completion Rate", `${data.completionRate}%`, true)
			.addField("❯ Followers", data.nbFollowers.toString(), true)
			.addField("❯ Following", data.nbFollowing.toString(), true)
			.addField("❯ Last Seen", new Date(data.seenAt).toUTCString(), true)
			.addField("❯ Playtime", data.playTime.total.toString(), true)
			.setThumbnail("https://images.prismic.io/lichess/5cfd2630-2a8f-4fa9-8f78-04c2d9f0e5fe_lichess-box-1024.png?auto=compress,format`");

		return message.channel.send({
			embeds: [
				profileEmbed,
			],
		});
	}
};