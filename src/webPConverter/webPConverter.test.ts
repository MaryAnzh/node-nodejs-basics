import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

import * as C from '../constants.ts';
import { convertImgToWebp, WebPConverterType } from './webPConverter.ts';
import { filterWithFormat } from './utils.ts';

const testFolder = `${C.TEST_FOLDER_NAME}_webP`;
const inputFolderName = 'img';
const outputFolderName = 'output';
const format = '.webp';
const tempInputFolder = path.resolve(testFolder, inputFolderName);
const tempOutputFolder = path.resolve(testFolder, outputFolderName);

const testFileName_1 = 'sample.png';
const testFileName_2 = 'sample.jpeg';
const testWrongFile = 'wrongFile.txt';

describe('webP converter', () => {
    beforeAll(async () => {
        await fs.mkdir(testFolder);
        await fs.mkdir(tempInputFolder, { recursive: true });
        const pngFile = await sharp({
            create: {
                width: 10,
                height: 10,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }
            }
        }).png().toBuffer();
        await fs.writeFile(path.join(tempInputFolder, testFileName_1), pngFile);

        const jpegFile = await sharp({
            create: {
                width: 10,
                height: 10,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }
            }
        }).jpeg().toBuffer();
        await fs.writeFile(path.join(tempInputFolder, testFileName_2), jpegFile);

        await fs.writeFile(path.join(tempInputFolder, testWrongFile), 'Not img file');
    });

    afterEach(async () => {
        await fs.rm(tempOutputFolder, { recursive: true, force: true });
    });

    afterAll(async () => {
        await fs.rm(testFolder, { recursive: true, force: true });
    });

    test('check convert files count (without wrong formats files)', async () => {
        const inputFolderFile = await fs.readdir(tempInputFolder);
        const imageFiles = filterWithFormat(inputFolderFile, C.WEB_P_FORMATS);
        const results = await convertImgToWebp(inputFolderName, outputFolderName, testFolder);
        expect(results.length).toBe(imageFiles.length);
    })

    test('check file conversion', async () => {
        const inputFolderFile = await fs.readdir(tempInputFolder);
        const imageFile = filterWithFormat(inputFolderFile, C.WEB_P_FORMATS).at(0);
        const results = await convertImgToWebp(inputFolderName, outputFolderName, testFolder);
        const firstInputFile = imageFile?.split('.').at(0);
        const firstOutputFile = (results as WebPConverterType).at(0)?.name;
        const checkName = firstInputFile === firstOutputFile;
        expect(checkName).toBe(true);
    })

    test('check conversion file format', async () => {
        const results = await convertImgToWebp(inputFolderName, outputFolderName, testFolder);
        const check = results.filter(({ path: p }) => path.extname(p) === format);
        expect(results.length === check.length).toBe(true);
    });

    test(`throw error if input folder empty or hasn't img file`, async () => {
        await fs.rm(path.resolve(tempInputFolder, testFileName_1));
        await fs.rm(path.resolve(tempInputFolder, testFileName_2));
        const inputFolderFile = await fs.readdir(tempInputFolder);
        const imageFiles = filterWithFormat(inputFolderFile, C.WEB_P_FORMATS);
        expect(imageFiles.length).toBe(0);
        await expect(convertImgToWebp(inputFolderName, outputFolderName, testFolder))
            .rejects
            .toThrow(new Error(`The ${inputFolderName} folder hasn't file for convert`));
    });

    test(`throw error if input folder doesn't exist`, async () => {
        await fs.rm(tempInputFolder, { recursive: true, force: true });
        await expect(convertImgToWebp(inputFolderName, outputFolderName, testFolder))
            .rejects
            .toThrow();
    });
});






