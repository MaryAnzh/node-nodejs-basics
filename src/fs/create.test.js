import { promises as fs } from 'fs';
import { create } from './create.js';
import * as C from '../constants.js';

describe('create file', () => {
    const fileName = C.FRESH_TXT;

    afterEach(async () => {
        try {
            await fs.unlink(fileName);
        } catch { console.error(C.TEST_FOULED) }
    });

    test('Create new file', async () => {
        await create();
        const content = await fs.readFile(fileName, 'utf-8');
        expect(content).toBe(C.CREATE_TEXT);
    });

    test('If file exist Throw error', async () => {
        await fs.writeFile(fileName, C.TEST);
        await expect(create()).rejects.toThrow(C.ERROR_MESSAGE_FS);
    });
});
