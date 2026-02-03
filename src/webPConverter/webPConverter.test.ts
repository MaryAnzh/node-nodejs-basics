import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

import * as C from '../constants';
import { convertImgToWebp } from './webPConverter';

const testFolder = `${C.TEST_FOLDER_NAME}_webP`;
const inputFolderName = 'img';
const outputFolderName = 'output';

const tempInputFolder = path.resolve(testFolder, inputFolderName);
const tempOutputFolder = path.resolve(testFolder, outputFolderName);

const testFileName_1 = 'sample.png';
const testFileName_2 = 'sample.jpeg';

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

        await fs.writeFile(path.join(tempInputFolder, 'wrongFile.txt'), 'wrong txt file');
    });

    afterAll(async () => {
        await fs.rm(testFolder, { recursive: true, force: true });
    });

    test('convertImgToWebp should convert files to WebP', async () => {
        const results = await convertImgToWebp(inputFolderName, outputFolderName, testFolder);
        expect(results.length).toBe(2);
        const outputFile1 = results[0];
        const outputFile2 = results[1];

        const exists = await fs.access(outputFile1)
            .then(() => true)
            .catch(() => false);

        expect(exists).toBe(true);
        const ext = path.extname(outputFile1);
        expect(ext).toBe('.webp');
    });
});






