import { readdir, readFile } from "fs/promises";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import * as process from "process";

let str = '';

async function getDir(pathFile: string) {
	const file = await readFile(pathFile, {encoding: "utf-8"})
	//console.log('file', file)

	const obj = JSON.parse(file);
	console.log('MAIN - obj',obj)
	await scanDocument(obj)
	console.log('str', str);
}

async function scanDocument (obj: any) {
	let count = 0;
	for(let value in obj){
		// console.log('scanDocument - цикл', obj[value]);
		// console.log('scanDocument тип', typeof obj[value]);

		if(typeof obj[value] === "number" || typeof obj[value] === "string"){
			console.log('is-str', obj[value])
			str += `${ await addSpace(count)}${obj[value]}\n`;
			count++;
		}
		if(typeof obj[value] !== "number" || typeof obj[value] !== "string"){
			 console.log(obj[value])

			for (let value2 in obj[value]){
			 	//console.log('is-object',obj[value][value2]);
			// await scanDocument(obj[value][value2])
			}
			await scanDocument(obj[value]);
			// str += `--${obj[value].name}\n`
		 //await scanDocument(obj[value].items);
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