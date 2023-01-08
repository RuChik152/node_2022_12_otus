import { readdir, readFile } from "fs/promises";
import meta from "url"
import crypto from "crypto";
import fs from "fs";
import path from "path";
import * as process from "process";


//const pathFile = path.resolve(process.cwd(), 'lesson1_mock.json');
// console.log(pathFile);
let str = '';

const test = async () => {
  try {
    const file = await readFile(path.resolve(process.cwd(), 'lesson1_mock.json'), {encoding: "utf-8"});
    const parse = await JSON.parse(file)
    for (let value in parse){
      test2(parse[value], value);
    }
  } catch (err) {

  }
}

let count = 0;

const test2 = async (value: any, name: any) => {

  console.log('value', value)
  const check = typeof value;

  if(check === "number"){
    str += `${addSpace(count)}${value.name}\n`;
    count++;
    console.log(str)
  }

  if(check === "object"){
    for (let item in value) {
      str += `${addSpace(count)}${value.name}`
      count++;
      test2(value[item].items, value[item].name)
    }
  }

}

const addSpace = (count: number) => {
  let str = '';
  const space = ' ';
  for(let i = count; i < count; i++){
    str += space;
  }
  return str;
}


test()
