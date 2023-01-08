import {resolve} from "path"
import {readdir} from "fs/promises"
import { PathLike } from "fs";


/**
 * @param {stirng} dir папка, с которой начинается сканирование
 * @returns {Promise<stirng[]>}
 */
// @ts-ignore
async function getFiles(dir: PathLike) {

	// читаем содержимое директории
	const dirents = await readdir(dir, { withFileTypes: true });

	// как и в прошлом примере проходимся по папкам
	// и, при необходимости рекурсивно вызываем функцию
	// @ts-ignore
	const files = await Promise.all(dirents.map((dirent) => {
		// @ts-ignore
		const res = resolve(dir, dirent.name);
		return dirent.isDirectory() ? getFiles(res) : res;
	}));

	// преобразуем массив файлов в одномерный
	return Array.prototype.concat(...files);
}


// тестируем
getFiles(process.cwd())
  .then((files: any) => console.log(files))
  .catch((err: any) => console.error(err));