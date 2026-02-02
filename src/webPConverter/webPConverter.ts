import { promises as fs } from 'fs';
import sharp from 'sharp';
import path from 'path';
import * as C from '../constants.ts';

export const convertImgToWebp = async (inputFolder: string, outputFolder: string) => {
    //read files from input dir
    const inputFolderPath = path.resolve(inputFolder);
    let filesSet: string[] = [];

    try {
        await fs.access(inputFolderPath);
        const files = await fs.readdir(inputFolderPath);
        filesSet = files;
    } catch {
        const errMessage = `${inputFolderPath} ${C.NOT_FOUND}`;
        throw new Error(errMessage);
    }

    if (filesSet.length === 0) {
        console.log(`The ${inputFolder} folder is clean`);
        return [];
    }

    const outputFolderPath = path.resolve(outputFolder);

    try {
        await fs.access(outputFolderPath);
        throw new Error(`${C.FOLDER_EXIST}: ${outputFolderPath}`);
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== C.ENOENT) {
            throw err;
        }
    }

    await fs.mkdir(outputFolderPath, { recursive: true });
    const results: string[] = [];
    for (const inputFileName of filesSet) {
        const inputPath = path.join(inputFolderPath, inputFileName);
        const fileName = path.basename(inputFileName, path.extname(inputFileName)) + '.webp';
        const outputPath = path.join(outputFolderPath, fileName);

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

console.log(await convertImgToWebp('img', 'webP'));
