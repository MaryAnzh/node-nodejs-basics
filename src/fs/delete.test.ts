import { promises as fs, unlink } from 'fs';
import path from 'path';
import { remove } from './delete';
import * as C from '../constants';

describe('delete file', () => {
    const folder = path.resolve(C.TEST_FOLDER_NAME);
    const fileName = 'wrongFilename.txt';
    const filePath = path.resolve(folder, fileName);

    beforeAll(async () => {
        await fs.mkdir(folder, { recursive: true });
    });

    beforeEach(async () => {
        await fs.rm(filePath, { force: true });
    });

    afterAll(async () => {
        await fs.rm(folder, { recursive: true, force: true });
    });

    test('successfully removes existing file', async () => {
        await fs.writeFile(filePath, C.TEST_CONTENT);
        await remove(fileName, C.TEST_FOLDER_NAME);
        await expect(fs.access(filePath)).rejects.toThrow();
    });

});
