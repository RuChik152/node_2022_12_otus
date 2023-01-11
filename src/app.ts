import { readdir } from "fs/promises";
import path from "path";
import * as process from "process";

const pathForDir = path.resolve(process.argv[2]);
const startPath = `${process.cwd()}\\${process.argv[2]}`;

interface Dirent {
  name: string;
  isDirectory: () => boolean;
}

interface PropsMap {
  nameChildDir: string;
  items: [];
  id: string;
}

class Tree {
  readonly pathFolder: string;
  readonly map: [PropsMap | string];
  readonly newMap: string[];
  readonly parentDir: Promise<Dirent[] | null>;

  constructor(pathFolder: string) {
    this.pathFolder = pathFolder;
    this.parentDir = this.#initParentDir();
    this.map = [`${path.resolve(process.argv[2])}`];
    this.newMap = [];
  }

  async #initParentDir() {
    try {
      return await readdir(this.pathFolder, {
        encoding: "utf-8",
        withFileTypes: true,
      });
    } catch (error) {
      console.log("ERR-initParentDir", error);
      return null;
    }
  }

  async startReadDirNode() {
    await this.#scanDir(startPath, process.argv[2]);
    await this.#replacePathFile();
    await this.#createMapDocument();
  }

  async #scanDir(pathFolder: string, pathName: string) {
    try {
      const dir = await readdir(pathFolder, {
        encoding: "utf-8",
        withFileTypes: true,
      });

      for (let value in dir) {
        this.map.push(`${pathFolder}\\${dir[value].name}`);
        if (dir[value].isDirectory()) {
          await this.#scanDir(
            `${pathFolder}\\${dir[value].name}`,
            dir[value].name
          );
        }
      }
    } catch (error) {
      console.log("scanDir", error);
      return null;
    }
  }

  #getMap() {
    return this.map;
  }

  #getNewMap() {
    return this.newMap;
  }

  async #replacePathFile() {
    const str = `${process.cwd()}\\`;
    const pathList = this.#getMap();

    pathList.forEach((el) => {
      if (typeof el === "string") {
        this.newMap.push(el.replace(str, ""));
      }
    });
  }

  async #createMapDocument() {
    let str = "";
    const arr = this.#getNewMap();

    arr.forEach((el) => {
      const value = el.match(/\\/gi);
      if (value !== null) {
        str += `\u2502${this.#addTabToString(
          value.length
        )}\u2514\u2500\u2500\u2500\u2500${el.replace(/^.*[\\\/]/gi, "")}\n`;
      } else {
        str += `${el.replace(/^.*[\\\/]/gi, "")}\n`;
      }
    });
    await console.log(str);
  }

  #addTabToString(count: number): string {
    let str = "";
    const hr = " ";

    for (let i = 0; i < count; i++) {
      str += hr;
    }

    return str;
  }
}

const test = new Tree(pathForDir).startReadDirNode();
