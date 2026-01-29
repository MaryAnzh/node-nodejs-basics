import { promises as fs } from 'fs';
import path from 'path';
import { rename } from './rename';
import * as C from '../constants';

describe('rename file', () => {
    const folder = path.resolve(C.TEST_FOLDER_NAME);
    const oldName = 'wrongFilename.txt';
    const newName = 'properFilename.md';
    const oldPath = path.join(folder, oldName);
    const newPath = path.join(folder, newName);

    beforeAll(async () => {
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(oldPath, C.TEST_CONTENT);
    });

    beforeEach(async () => {
        await fs.rm(oldPath, { force: true });
        await fs.rm(newPath, { force: true });
        await fs.writeFile(oldPath, C.TEST_CONTENT);
    });

    afterAll(async () => {
        await fs.rm(folder, { recursive: true, force: true });
    });

    test('rename file', async () => {
        await rename(oldName, newName, C.TEST_FOLDER_NAME);
        const content = await fs.readFile(newPath, 'utf-8');
        expect(content).toBe(C.TEST_CONTENT);
    });

    test('throw an error if the file is missing', async () => {
        await fs.rm(oldPath, { force: true });
        await expect(rename(oldName, newName, C.TEST_FOLDER_NAME)).rejects.toThrow(`Couldn't find file: ${oldName}`);
    });

    test('throw an error if file with newName exist', async () => {
        await fs.writeFile(newPath, 'already exists');
        await expect(rename(oldName, newName, C.TEST_FOLDER_NAME)).rejects.toThrow(`The file with new name: ${newName} -- exist`);
    });
});
