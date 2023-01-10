import { readdir, readFile } from "fs/promises";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import * as process from "process";

let str = '';

async function getDir(pathFile: string) {
	const file = await readFile(pathFile, {encoding: "utf-8"})

	const obj = JSON.parse(file);
	await scanDocument(obj)
	console.log('str', str);
}

let counts = 0;
async function scanDocument (obj: any) {

	for(let value in obj){

		if(typeof obj[value] === "number" || typeof obj[value] === "string"){
			const strCount = await addSpace(counts);
			str += `${strCount} ${obj[value]}\n`;
			await counts++;
		}
		
		if(typeof obj[value] !== "number" || typeof obj[value] !== "string"){

			for (let value2 in obj[value]){
			}
			await scanDocument(obj[value]);
		}
	}
}

async function addSpace(count: number = 0) {
	const space = '-';
	let str = '';
	for(let i = 0; i < count; i++) {
		str += space;
	}
	return str;
}

// console.log('TEMPLATE',`
// 1
// |--2
// |----3
// |----4
// |--5
// |--6
// `)

const pathFile = path.resolve(process.cwd(), 'lesson1_mock.json');
getDir(pathFile);