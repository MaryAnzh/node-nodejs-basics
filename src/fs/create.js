import { promises as fs } from 'fs';

export const create = async () => {
    try {
        await fs.writeFile('fresh.txt', 'I am fresh and young', { flag: 'wx' });
        console.log('Файл успешно создан!');
    } catch (err) {
        if (err.code === 'EEXIST') {
            throw new Error('FS operation failed'); // файл уже существует
        } else {
            console.error('Ошибка при создании файла:', err);
            throw err;
        }
    }
};
