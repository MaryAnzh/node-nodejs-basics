import { promises as fs } from 'fs';
import { create } from './create.js';

describe('create function', () => {
    const fileName = 'fresh.txt';

    afterEach(async () => {
        try {
            await fs.unlink(fileName);
        } catch { }
    });

    test('создаёт новый файл', async () => {
        await create();
        const content = await fs.readFile(fileName, 'utf-8');
        expect(content).toBe('I am fresh and young');
    });

    test('выбрасывает ошибку, если файл уже существует', async () => {
        await fs.writeFile(fileName, 'test');
        await expect(create()).rejects.toThrow('FS operation failed');
    });
});
