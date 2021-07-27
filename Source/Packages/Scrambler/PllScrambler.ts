// keys are PLL cases

import { join } from "path";
import { LensClient } from "../../Base/Client";

/*

> ** Block position explanation ***
* Some PLLs have a block or two. For example, U-perms have 1x3 block, J-perms have one 1x3 and one 1x2 block. A&V have two 1x2 blocks, Z,H,E dont have blocks.
* I denote block position with two letters. BL means this: if PLL have only one block, it will be on the back. If two, they will be on the back and left sides. Examples for PLL cases with BL block:
* Ja will have 1x3 block on the back and 1x2 on the left; Jb - 1x3 on the left and 1x2 on the back
* A-perm will basically be a threecycle UFL -> UFR -> UBR
* U-perm will have its only block on the back. G-perms will also have their 1x2 blocks on the back.
* Z,H,E,N can be in any position

* So the most difficult (and interesting) challenge here is to only generate PLLs with BL block and try to recognize it by two sides (only looking at front and right side).

? algs structure
? algs[name] =
{
	no AUF: [array of algs that solve "name" case with block on BL]
	U: [array of algs that solve "name+U" case. "name+U" has block on RB]
	U2: [array of algs that solve "name+U2" case. "name+U2" has block on FR]
	U': [array of algs that solve "name+U`" case. "name+U`" has block on LF]
}

? After being selected, an alg is being modified in one of 4 different ways to move the block from its original position to a desired (or randomly generated) position. So 25*4*4 = 400 algs for each PLL case should be enough.

*/

type BlockPosition = "BL" | "RB" | "FR" | "LF";

export default class PllScrambler {
	private algs: any;
	private client: LensClient;

	constructor(client: LensClient) {
		this.client = client;
		this.load();
	}

	// Just loading the stuff up.
	private async load() {
		this.algs = await this.client.util.loadJSON(join(__dirname, "../../../Assets/JSON/PLLScramblerAlgs.json"));
	}

	// @ts-ignore
	public generateScramble() {
		const pllName = this.getRandomElementFromArray(this.getPlls());
		const auf = this.getRandomElementFromArray(this.getAvailableAufs());
		const blockPos = (this.getRandomElementFromArray(this.getAvailableBlockPos()) as BlockPosition);

		if(this.algs[pllName][auf] === null || this.algs[pllName][auf].length === 0) return this.generateScramble();

		const alg = this.getRandomElementFromArray(this.algs[pllName][auf]) as string;

		const finalAlg = this.moveBlock("BL", blockPos, alg);

		return finalAlg;
	}

	private getPlls() {
		return Object.keys(this.algs);
	}

	private getAvailableAufs() {
		return ["U", "noAuf", "U'", "U2"];
	}

	private getAvailableBlockPos() {
		return ["BL", "RB", "FR", "LF"];
	}

	// returns algoritm with block on desiredPos, considering that alg has block on prevPos
	private moveBlock(prevPos: BlockPosition, desiredPos: BlockPosition, alg: string) {
		const aufs = {
			BL: {
				BL: "",
				RB: "y",
				FR: "y2",
				LF: "y'",
			},
			RB: {
				BL: "y'",
				RB: "",
				FR: "y",
				LF: "y2",
			},
			FR: {
				BL: "y2",
				RB: "y'",
				FR: "",
				LF: "y",
			},
			LF: {
				BL: "y",
				RB: "y2'",
				FR: "y'",
				LF: "",
			},
		};

		const rot = aufs[prevPos][desiredPos] as "y'" | "" | "y2" | "y";
		const newAlg = this.applyRotationForAlgorithm(alg, rot);
		return newAlg;
	}

	// returns new string with transformed algorithm.
	// Returnes sequence of moves that get the cube to the same position as (alg + rot) does, but without cube rotations.
	// Example: applyRotationForAlgorithm("R U R'", "y") = "F U F'"
	private applyRotationForAlgorithm(alg: string, rot: "y" | "y2" | "y'" | "") {
		let mapObj;

		if (rot == "y") {mapObj = { R:"F", F:"L", L:"B", B:"R" };}
		if (rot == "y'") {mapObj = { R:"B", B:"L", L:"F", F:"R" };}
		if (rot == "y2") {mapObj = { R:"L", L:"R", B:"F", F:"B" };}

		return this.replaceAll(alg, mapObj);
	}

	private replaceAll(str: string, mapObj?: { [key: string]: string }) {
		if(!mapObj) return str;

		const reg = new RegExp(Object.keys(mapObj).join("|"), "gi");

		return str.replace(reg, (matched) => mapObj[matched]);
	}

	private getRandomElementFromArray<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}
}