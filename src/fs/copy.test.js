import { promises as fs } from 'fs';
import path from 'path';
import { copy } from './copy.js';
import * as C from '../constants.js';

describe('Copy file', () => {
    const folderName = C.TEST;
    const folderCopeName = `${folderName}_copy`;
    const testFolderPath = 'src/fs/';
    const testSrcDir = `${testFolderPath}${folderName}`;
    const testDestDir = `${testFolderPath}${folderCopeName}`

    beforeEach(async () => {
        // create test folder
        await fs.mkdir(testSrcDir, { recursive: true });
        await fs.writeFile(path.join(testSrcDir, 'test.txt'), C.TEST);

        try {
            await fs.rm(testDestDir, { recursive: true, force: true });
        } catch { }
    });

    afterEach(async () => {
        // remove test folders
        try {
            await fs.rm(testSrcDir, { recursive: true, force: true });
            await fs.rm(testDestDir, { recursive: true, force: true });
        } catch { }
    });

    test('Copy folder test in test_copy', async () => {
        await copy(testSrcDir, testDestDir);
        const copied = await fs.readFile(path.join(testDestDir, 'test.txt'), 'utf-8');
        expect(copied).toBe(C.TEST);
    });

    test('Throw error if destDir exist', async () => {
        await fs.mkdir(testDestDir);
        await expect(copy(testSrcDir, testDestDir)).rejects.toThrow(C.ERROR_MESSAGE_FS);
    });
});
