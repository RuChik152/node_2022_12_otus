import { readdir } from "fs/promises";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import * as process from "process";

// const pathNodeModule = path.resolve(process.cwd(), "page_3");
//console.log(pathNodeModule);

//
// readDirNodeModules();

const pathForDir = path.resolve(process.argv[2]);
const startPath = `${process.cwd()}\\${process.argv[2]}`;
console.log(pathForDir);

// const readDirNodeModules = async (): Promise<void> => {
//   try {
//     const dir = await readdir(pathForDir);
//     console.log(dir);
//   } catch (error) {
//     console.log("ERR", error);
//   }
// };

//readDirNodeModules();

interface Dirent {
	name: string;
	isDirectory: () => boolean;
}

interface PropsMap {
	nameChildDir: string;
	items: [];
	id: string;
}

export class Tree {
	readonly pathFolder: string;
	readonly map: [PropsMap | string];
	readonly parentDir: Promise<Dirent[] | null>;

	constructor(pathFolder: string) {
		this.pathFolder = pathFolder;
		this.parentDir = this.initParentDir();
		this.map = [`${process.argv[2]}`];
	}

	async initParentDir() {
		try {
			return await readdir(this.pathFolder, { encoding: "utf-8", withFileTypes: true, });
		} catch (error) {
			console.log("ERR-initParentDir", error);
			return null;
		}
	}

	async scanDir(pathFolder: string, pathName: string, id: null | string = null ) {
		try {
			if(id === null) {
				console.log('IF')
				await readdir(pathFolder, { encoding: "utf-8", withFileTypes: true,}).then((data) =>
					data.filter((el) => {
						if (el.isDirectory()) {

							//console.log(`dir - ${el.name} => `, path.resolve(pathFolder, el.name));

							const id = crypto.randomUUID()

							this.map.push({nameChildDir: el.name, items: [], id });

							this.scanDir(path.resolve(pathFolder, el.name), el.name, id);

						} else {
							this.map.push(el.name);
							//console.log("file", path.resolve(pathFolder, el.name));
						}
					})
				);
			} else {
				console.log('ELSE')
				await readdir(pathFolder, { encoding: "utf-8", withFileTypes: true,}).then((data) =>
					data.filter((el) => {
						if (el.isDirectory()) {

							//console.log(`dir - ${el.name} => `, path.resolve(pathFolder, el.name));

							// this.map.push({nameChildDir: el.name, items: [], id });

							const obj = this.getLinkObject(id);
							//@ts-ignore
							obj.items.push({nameChildDir: el.name, items: [], id })

							this.scanDir(path.resolve(pathFolder, el.name), el.name, id);

						} else {
							const obj = this.getLinkObject(id);
							//@ts-ignore
							obj.items.push(el.name);
							this.map.push(el.name);
							//console.log("file", path.resolve(pathFolder, el.name));
						}
					})
				);
			}

		} catch (error) {
			console.log("scanDir", error);
			return null;
		}
	}

	getLinkObject(id: string) {
		this.map.filter((el: any) => {
			if(el.id === id) {
				return true
			} else {
				this.getLinkObject(id)
			}

		})
	}

	async startReadDirNode() {
		// console.log("startReadDirNode - cwd", process.cwd());
		// console.log("startReadDirNode - argv", process.argv);
		// console.log("startReadDirNode - startPath", startPath);

		await this.scanDir(startPath, process.argv[2]);
		await console.log("MAP", this.map);
		// try {
		//   const scan = await readdir(this.pathFolder, {
		//     encoding: "utf-8",
		//     withFileTypes: true,
		//   });
		//   console.log(scan);
		//   scan.forEach((el) => {
		//     this.dirOrFile(el);
		//   });
		// } catch (error) {
		//   console.log(error);
		// }
		// try {
		//   this.parentDir.then((data) => {
		//     if (data !== null) {
		//       data.forEach((el) => {
		//         if (el.isDirectory()) {
		//           const pathParent = path.resolve(this.pathFolder, el.name);
		//           const nameChildDir = el.name;
		//           const id = crypto.randomUUID();
		//           this.map.push({ nameChildDir, items: [], id });
		//           this.childScan(pathParent, nameChildDir, id);
		//         } else {
		//           this.map.push(el.name);
		//         }
		//       });
		//     }
		//   });
		// } catch (error) {
		//   console.log("ERR-startReadDirNode", error);
		//   return null;
		// }
	}

	// async childScan(
	//   pathParent: string,
	//   nameChildDir: string,
	//   idParentObject: string
	// ) {
	//   try {
	//     const pathChildFolder = path.resolve(pathParent);
	//     const scanCurrentDir = await readdir(pathChildFolder, {
	//       encoding: "utf-8",
	//       withFileTypes: true,
	//     });
	//     console.log(`this.map`, this.map);
	//     //console.log(`${nameChildDir}`, scanCurrentDir);
	//
	//     scanCurrentDir.forEach((el) => {
	//       if (el.isDirectory()) {
	//       } else {
	//         const currentObject = this.findCurrentObject(idParentObject, this.map);
	//         currentObject.items.push(el.name);
	//       }
	//     });
	//   } catch (error) {
	//     console.log("ERR-childScan", error);
	//     return null;
	//   }
	// }

	// async findCurrentObject(id: string, arr: object | []) {
	//   arr.filter((el: PropsMap) => {
	//       if(typeof el === "object"){
	//         if(el.id !== id && el.items.length !== 0) {
	//
	//         } else
	//       }
	//   });
	// }
}

// new Tree(pathForDir).startReadDirNode();