import { promises as fs } from 'fs';
import path from 'path';

import { read } from './read';
import * as C from '../constants.ts';

describe('read file', () => {
    const folderName = `${C.TEST_FOLDER_NAME}_read`;
    const folder = path.resolve(folderName);
    const fileName = 'fileToRead.txt';
    const filePath = path.join(folder, fileName);

    beforeAll(async () => {
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(filePath, C.TEST_CONTENT);
    });

    afterAll(async () => {
        await fs.rm(folder, { recursive: true, force: true });
    });

    test('prints file content when file exists', async () => {
        const spy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await read(fileName, folderName);
        expect(spy).toHaveBeenCalledWith(C.TEST_CONTENT);
        spy.mockRestore();
    });

    test('throws error if file does not exist', async () => {
        await fs.rm(filePath);
        await expect(read(fileName, folderName)).rejects.toThrow(C.ERROR_MESSAGE_FS);
    });
});
