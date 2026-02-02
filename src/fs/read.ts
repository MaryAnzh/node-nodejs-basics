import { promises as fs } from 'fs';
import path from 'path';
import * as C from '../constants.ts';

export const read = async (fileName: string, folderName: string) => {
    const filePath = path.join(folderName, fileName);

    try {
        await fs.access(filePath);
        const content = await fs.readFile(filePath, 'utf-8');
        console.log(content);
    } catch {
        throw new Error(C.ERROR_MESSAGE_FS);
    }
};

// пример вызова 
//read('fileToRead.txt', C.FILES);
