import { promises as fs } from 'fs';
import sharp from 'sharp';
import path from 'path';
import * as C from '../constants.ts';

const formats = [
    'jpg', 'jpeg', 'png', 'tif', 'tiff', 'avif', 'svg', 'raw'
];
const filterFormats = (fileNames: string[]) =>
    fileNames
        .filter((name) => {
            const format = name.split('.').at(-1);
            return format === undefined
                ? undefined
                : formats.includes(format);
        });

const checkOutputPath = (outputFolderPath: string, arr: string[], inputFileName: string, index = 0): string => {
    const baseName = path.basename(inputFileName, path.extname(inputFileName));
    const fileName = index === 0 ? `${baseName}.webp` : `${baseName}_${index}.webp`;
    const p = path.join(outputFolderPath, fileName);

    if (arr.includes(p)) {
        return checkOutputPath(outputFolderPath, arr, inputFileName, index + 1);
    }
    return p;
};

export const convertImgToWebp = async (inputFolder: string, outputFolder: string, dirPath: string) => {
    //read files from input dir
    const makePath = (folderName: string) => `${dirPath}/${folderName}`;
    const inputFolderPath = path.resolve(process.cwd(), makePath(inputFolder));
    const outputFolderPath = path.resolve(process.cwd(), makePath(outputFolder));
    let filesSet: string[] = [];

    try {
        await fs.access(inputFolderPath);
        const files = await fs.readdir(inputFolderPath);
        filesSet = filterFormats(files);
    } catch {
        const errMessage = `${inputFolderPath} ${C.NOT_FOUND}`;
        throw new Error(errMessage);
    }

    if (filesSet.length === 0) {
        console.log(`The ${inputFolder} folder hasn't file for convert`);
        return filesSet;
    }

    try {
        await fs.access(outputFolderPath);
        const content = await fs.readdir(outputFolderPath, { recursive: true });
        if (content.length > 0) {
            throw new Error(`${C.FOLDER_EXIST}: ${outputFolderPath}`);
        }
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== C.ENOENT) {
            throw err;
        }
    }

    await fs.mkdir(outputFolderPath, { recursive: true });
    const results: string[] = [];

    for (const inputFileName of filesSet) {
        const inputPath = path.join(inputFolderPath, inputFileName);
        const outputPath = checkOutputPath(outputFolderPath, results, inputFileName);

        try {
            await sharp(inputPath).webp({ quality: 80 })
                .toFile(outputPath);
            results.push(outputPath);
        } catch {
            console.log(`Couldn't convert the ${inputFileName}`);
        }
    }

    return results;
};

// (async () => {
//     const data = await convertImgToWebp('img', 'webP', 'src/access');
//     console.log(data);
// })();